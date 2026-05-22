from rest_framework import serializers

from .models import Meeting, Participant



# Participant Serializer
class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:

        model = Participant

        fields = [
            'id',
            'display_name',
            'joined_at'
        ]



# Meeting Serializer
class MeetingSerializer(serializers.ModelSerializer):

    # Show All Participants
    participants = ParticipantSerializer(
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
            'title',
            'description',
            'meeting_type',
            'invite_link',
            'scheduled_time',
            'duration',
            'created_at',
            'is_active',
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

        return obj.participants.count()