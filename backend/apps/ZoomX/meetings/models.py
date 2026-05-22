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


    # Save Function
    def save(self, *args, **kwargs):
        # Auto-generate a unique 8-character meeting ID on first save
        if not self.meeting_id:
            self.meeting_id = str(uuid.uuid4())[:8]
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
        related_name='participants'
    )

    # Participant Name
    display_name = models.CharField(max_length=100)

    # Join Time
    joined_at = models.DateTimeField(auto_now_add=True)


    # Display Participant Name
    def __str__(self):
        return self.display_name