import json
from channels.generic.websocket import AsyncWebsocketConsumer

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
            # Tell all OTHER peers in room that a new peer joined
            await self.channel_layer.group_send(
                self.room_group,
                {
                    'type': 'peer_joined',
                    'peer_id': self.channel_name,
                    'name': data.get('name', 'Guest'),
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
            # Broadcast chat message to entire room
            await self.channel_layer.group_send(
                self.room_group,
                {
                    'type': 'chat_message',
                    'message': data['message'],
                    'name': data['name'],
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
