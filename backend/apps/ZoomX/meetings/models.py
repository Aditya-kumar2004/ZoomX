from django.db import models
from django.contrib.auth.models import User
import uuid
import os


# Meeting Table
class Meeting(models.Model):

    # Host of the meeting
    host = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='meetings',
        null=True,
        blank=True
    )

    # Meeting ID
    meeting_id = models.CharField(max_length=20, unique=True)

    # Meeting Title
    title = models.CharField(max_length=200)

    # Meeting Description
    description = models.TextField(blank=True)

    class MeetingType(models.TextChoices):
        INSTANT = 'instant', 'Instant'
        SCHEDULED = 'scheduled', 'Scheduled'

    # Meeting Type
    meeting_type = models.CharField(
        max_length=20,
        choices=MeetingType.choices,
        default=MeetingType.INSTANT
    )

    # Invite Link
    invite_link = models.CharField(max_length=500)

    # Meeting Time
    scheduled_time = models.DateTimeField(null=True, blank=True)

    # Duration in Minutes
    duration = models.IntegerField(default=60)

    # Created Time
    created_at = models.DateTimeField(auto_now_add=True)

    # Meeting Active or Not
    is_active = models.BooleanField(default=True)

    # Participants ManyToMany relationship through Participant table
    participants = models.ManyToManyField(
        User,
        through='Participant',
        related_name='participated_meetings'
    )

    # Meeting Code (matches meeting_id for Zoom alignment)
    meeting_code = models.CharField(max_length=20, unique=True, null=True, blank=True)

    # Soft delete flag to hide deleted meetings from user dashboard while keeping them in DB
    is_deleted = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['host', 'created_at']),
        ]


    # Save Function
    def save(self, *args, **kwargs):
        # Auto-generate a unique 8-character meeting ID on first save
        if not self.meeting_id:
            self.meeting_id = str(uuid.uuid4())[:8]
        if not self.meeting_code:
            self.meeting_code = self.meeting_id
        base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
        self.invite_link = f"{base_url}/meeting/{self.meeting_id}"
        super().save(*args, **kwargs)


    # Display Name
    def __str__(self):
        return self.title



# Participant Table
class Participant(models.Model):

    # Connect Participant with Meeting
    meeting = models.ForeignKey(
        Meeting,
        on_delete=models.CASCADE,
        related_name='participant_sessions'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='participant_sessions'
    )

    # Participant Name
    display_name = models.CharField(max_length=100)

    is_host = models.BooleanField(default=False)

    # Join Time
    joined_at = models.DateTimeField(auto_now_add=True)

    # WebSocket connection tracking fields
    channel_name = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    left_at = models.DateTimeField(null=True, blank=True)
    reconnect_count = models.IntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['meeting', 'is_active']),
            models.Index(fields=['meeting', 'joined_at']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['meeting', 'user'],
                condition=models.Q(user__isnull=False),
                name='unique_meeting_user'
            )
        ]

    # Save Function to compute is_host dynamically
    def save(self, *args, **kwargs):
        if self.user and self.meeting.host == self.user:
            self.is_host = True
        else:
            self.is_host = False
        super().save(*args, **kwargs)

    # Display Participant Name
    def __str__(self):
        return self.display_name


# Chat Message Table
class ChatMessage(models.Model):
    meeting = models.ForeignKey(
        Meeting,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_messages'
    )
    sender_name = models.CharField(max_length=100)
    sender_email = models.EmailField(null=True, blank=True)
    sender_avatar = models.CharField(max_length=500, null=True, blank=True)
    message = models.TextField()
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    MESSAGE_TYPES = (
        ('chat', 'Chat Message'),
        ('system', 'System Notification'),
        ('control', 'Control Command'),
    )
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='chat')

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['meeting', 'created_at']),
        ]

    def __str__(self):
        return f"{self.sender_name}: {self.message[:20]}"