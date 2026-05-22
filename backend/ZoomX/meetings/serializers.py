from rest_framework import serializers

from .models import Meeting, Participant, ChatMessage



# Participant Serializer
class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:

        model = Participant

        fields = [
            'id',
            'display_name',
            'is_host',
            'joined_at',
            'channel_name',
            'is_active',
            'left_at'
        ]


# Chat Message Serializer
class ChatMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.IntegerField(source='sender.id', read_only=True, allow_null=True)
    sender_username = serializers.CharField(source='sender.username', read_only=True, allow_null=True)

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'sender_id',
            'sender_username',
            'sender_name',
            'sender_email',
            'sender_avatar',
            'message',
            'is_deleted',
            'created_at'
        ]




# Meeting Serializer
class MeetingSerializer(serializers.ModelSerializer):

    # Show All Participants
    participants = ParticipantSerializer(
        source='participant_sessions',
        many=True,
        read_only=True
    )

    # Count Total Participants
    participant_count = serializers.SerializerMethodField()


    host_email = serializers.SerializerMethodField()

    class Meta:

        model = Meeting

        fields = [

            'id',
            'meeting_id',
            'meeting_code',
            'title',
            'description',
            'meeting_type',
            'invite_link',
            'scheduled_time',
            'duration',
            'created_at',
            'is_active',
            'is_deleted',
            'host_email',

            # Extra Fields
            'participants',
            'participant_count',
        ]

    def get_host_email(self, obj):
        if obj.host:
            return obj.host.email
        return None


    # Function to Count Participants
    def get_participant_count(self, obj):

        return obj.participant_sessions.count()