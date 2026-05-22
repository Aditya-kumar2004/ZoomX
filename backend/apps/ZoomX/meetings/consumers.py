import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from django.contrib.auth.models import User
from .models import Meeting, Participant, ChatMessage
from .serializers import ParticipantSerializer

@database_sync_to_async
def save_participant_connection(meeting_id, display_name, email, channel_name, scope_user=None):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
        user = None
        if scope_user and scope_user.is_authenticated:
            user = scope_user
        elif email:
            user = User.objects.filter(email=email).first()

        is_host = False
        if user and meeting.host == user:
            is_host = True

        participant = None
        if user:
            participant = Participant.objects.filter(meeting=meeting, user=user).order_by('is_active').first()
        if not participant:
            participant = Participant.objects.filter(meeting=meeting, display_name=display_name).order_by('is_active').first()
        
        if participant:
            participant.channel_name = channel_name
            if not participant.is_active:
                participant.reconnect_count += 1
            participant.is_active = True
            participant.left_at = None
            if user:
                participant.user = user
            participant.is_host = is_host or participant.is_host
            participant.save()
        else:
            participant = Participant.objects.create(
                meeting=meeting,
                user=user,
                display_name=display_name,
                channel_name=channel_name,
                is_active=True,
                is_host=is_host
            )
        return participant.id
    except Exception as e:
        print(f"Error saving participant connection: {e}")
        return None

@database_sync_to_async
def get_active_participants_info(meeting_id):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
        active_participants = Participant.objects.filter(meeting=meeting, is_active=True).select_related('user')
        active_count = active_participants.count()
        serializer = ParticipantSerializer(active_participants, many=True)
        return {
            'count': active_count,
            'list': serializer.data
        }
    except Exception as e:
        print(f"Error in get_active_participants_info: {e}")
        return {
            'count': 0,
            'list': []
        }

@database_sync_to_async
def disconnect_participant(channel_name):
    try:
        # Mark participant as inactive and record left time
        Participant.objects.filter(channel_name=channel_name).update(
            is_active=False,
            left_at=timezone.now()
        )
    except Exception as e:
        print(f"Error disconnecting participant: {e}")

@database_sync_to_async
def save_chat_message(meeting_id, sender_name, sender_email, sender_avatar, message, scope_user=None):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
        user = None
        if scope_user and scope_user.is_authenticated:
            user = scope_user
        elif sender_email:
            user = User.objects.filter(email=sender_email).first()
        return ChatMessage.objects.create(
            meeting=meeting,
            sender=user,
            sender_name=sender_name,
            sender_email=sender_email or None,
            sender_avatar=sender_avatar or None,
            message=message
        )
    except Exception as e:
        print(f"Error saving chat message: {e}")
        return None

class MeetingConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.meeting_id = self.scope['url_route']['kwargs']['meeting_id']
        self.room_group = f'meeting_{self.meeting_id}'
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group,
            self.channel_name
        )
        await self.accept()
        print(f"[WS] Connected to room: {self.meeting_id}")

    async def disconnect(self, close_code):
        # Update participant state in DB
        await disconnect_participant(self.channel_name)

        # Get updated active participants info
        info = await get_active_participants_info(self.meeting_id)

        # Broadcast participant_update to room
        await self.channel_layer.group_send(
            self.room_group,
            {
                'type': 'participant_update',
                'count': info['count'],
                'participants': info['list']
            }
        )

        # Notify others this peer left
        await self.channel_layer.group_send(
            self.room_group,
            {
                'type': 'peer_left',
                'peer_id': self.channel_name,
            }
        )
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get('type')

        if msg_type == 'join':
            raw_name = data.get('name', 'Guest')
            
            # Parse display name, email, avatar from name string
            parts = raw_name.split('__')
            metadata_part = parts[0]
            meta_parts = metadata_part.split('||')
            
            display_name = meta_parts[0]
            email = meta_parts[1] if len(meta_parts) > 1 else ""
            
            # Save the participant connection to SQLite
            await save_participant_connection(
                self.meeting_id,
                display_name,
                email,
                self.channel_name,
                scope_user=self.scope.get("user")
            )

            # Get active participants info
            info = await get_active_participants_info(self.meeting_id)

            # Broadcast participant_update to room
            await self.channel_layer.group_send(
                self.room_group,
                {
                    'type': 'participant_update',
                    'count': info['count'],
                    'participants': info['list']
                }
            )

            # Tell all OTHER peers in room that a new peer joined
            await self.channel_layer.group_send(
                self.room_group,
                {
                    'type': 'peer_joined',
                    'peer_id': self.channel_name,
                    'name': raw_name,
                }
            )

        elif msg_type == 'offer':
            # Forward WebRTC offer to specific peer
            await self.channel_layer.send(
                data['target'],
                {
                    'type': 'webrtc_offer',
                    'offer': data['offer'],
                    'sender': self.channel_name,
                    'name': data.get('name', 'Guest'),
                }
            )

        elif msg_type == 'answer':
            # Forward WebRTC answer to specific peer
            await self.channel_layer.send(
                data['target'],
                {
                    'type': 'webrtc_answer',
                    'answer': data['answer'],
                    'sender': self.channel_name,
                }
            )

        elif msg_type == 'ice_candidate':
            # Forward ICE candidate to specific peer
            await self.channel_layer.send(
                data['target'],
                {
                    'type': 'webrtc_ice',
                    'candidate': data['candidate'],
                    'sender': self.channel_name,
                }
            )

        elif msg_type == 'chat':
            message_text = data['message']
            raw_name = data['name']
            
            # Save to SQLite if not a WebRTC/Moderation control command
            if not message_text.startswith('__CONTROL__:'):
                parts = raw_name.split('__')
                metadata_part = parts[0]
                meta_parts = metadata_part.split('||')
                
                display_name = meta_parts[0]
                email = meta_parts[1] if len(meta_parts) > 1 else ""
                avatar = meta_parts[2] if len(meta_parts) > 2 else ""
                
                await save_chat_message(
                    self.meeting_id,
                    display_name,
                    email,
                    avatar,
                    message_text,
                    scope_user=self.scope.get("user")
                )

            # Broadcast chat message to entire room
            await self.channel_layer.group_send(
                self.room_group,
                {
                    'type': 'chat_message',
                    'message': message_text,
                    'name': raw_name,
                    'sender': self.channel_name,
                }
            )

    # ── Handlers (called when group_send fires) ──────────────────────────────

    async def peer_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'peer_joined',
            'peer_id': event['peer_id'],
            'name': event['name'],
        }))

    async def peer_left(self, event):
        await self.send(text_data=json.dumps({
            'type': 'peer_left',
            'peer_id': event['peer_id'],
        }))

    async def webrtc_offer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'offer',
            'offer': event['offer'],
            'sender': event['sender'],
            'name': event['name'],
        }))

    async def webrtc_answer(self, event):
        await self.send(text_data=json.dumps({
            'type': 'answer',
            'answer': event['answer'],
            'sender': event['sender'],
        }))

    async def webrtc_ice(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ice_candidate',
            'candidate': event['candidate'],
            'sender': event['sender'],
        }))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'message': event['message'],
            'name': event['name'],
            'sender': event['sender'],
        }))

    async def participant_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'participant_update',
            'count': event['count'],
            'participants': event['participants'],
        }))
