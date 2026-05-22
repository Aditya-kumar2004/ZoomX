import os
import django
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZoomX.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from meetings.models import Meeting, Participant

# Clear old data
Meeting.objects.all().delete()
print("Old data cleared...")

# Create instant/recent meetings
m1 = Meeting.objects.create(
    title="Team Standup",
    meeting_type="instant",
    duration=30,
)
m2 = Meeting.objects.create(
    title="Product Review",
    meeting_type="instant",
    duration=60,
)
m3 = Meeting.objects.create(
    title="Design Discussion",
    meeting_type="instant",
    duration=45,
)

# Create upcoming scheduled meetings
m4 = Meeting.objects.create(
    title="Sprint Planning",
    meeting_type="scheduled",
    scheduled_time=timezone.now() + timedelta(days=1),
    duration=90,
    description="Planning session for next sprint",
)
m5 = Meeting.objects.create(
    title="Client Demo",
    meeting_type="scheduled",
    scheduled_time=timezone.now() + timedelta(days=2),
    duration=60,
    description="Demo for the client team",
)
m6 = Meeting.objects.create(
    title="Interview Round",
    meeting_type="scheduled",
    scheduled_time=timezone.now() + timedelta(days=3),
    duration=45,
    description="Technical interview round",
)

# Add participants
Participant.objects.create(meeting=m1, display_name="Rahul Shah")
Participant.objects.create(meeting=m1, display_name="Priya Nair")
Participant.objects.create(meeting=m2, display_name="Marcus Reid")
Participant.objects.create(meeting=m3, display_name="Sarah Chen")

print("Seed data created successfully!")
print(f"Total meetings: {Meeting.objects.count()}")