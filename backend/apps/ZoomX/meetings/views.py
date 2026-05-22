from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
import os

from .models import Meeting, Participant
from .serializers import MeetingSerializer, ParticipantSerializer



# API 1 -----------------------------
# Create Instant Meeting
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_meeting(request):

    meeting = Meeting.objects.create(
        host=request.user,
        title="Instant Meeting",
        meeting_type="instant"
    )

    base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    meeting.invite_link = f"{base_url}/meeting/{meeting.meeting_id}"
    meeting.save()

    serializer = MeetingSerializer(meeting)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )



# API 2 -----------------------------
# Get Meeting Details
@api_view(['GET'])

def get_meeting(request, meeting_id):

    try:
        meeting = Meeting.objects.get(
            meeting_id=meeting_id
        )

        serializer = MeetingSerializer(meeting)

        return Response(serializer.data)

    except Meeting.DoesNotExist:

        return Response(
            {"error": "Meeting Not Found"},
            status=status.HTTP_404_NOT_FOUND
        )



# API 3 -----------------------------
# Join Meeting
@api_view(['POST'])

def join_meeting(request, meeting_id):

    try:
        meeting = Meeting.objects.get(
            meeting_id=meeting_id
        )

        # Get User Name
        display_name = request.data.get(
            "display_name",
            "Guest"
        )

        # Create Participant
        participant = Participant.objects.create(
            meeting=meeting,
            display_name=display_name
        )

        return Response({

            "meeting":
            MeetingSerializer(meeting).data,

            "participant":
            ParticipantSerializer(participant).data

        })

    except Meeting.DoesNotExist:

        return Response(
            {"error": "Meeting Not Found"},
            status=status.HTTP_404_NOT_FOUND
        )



# API 4 -----------------------------
# Schedule Meeting
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def schedule_meeting(request):

    title = request.data.get(
        "title",
        "Scheduled Meeting"
    )

    description = request.data.get(
        "description",
        ""
    )

    scheduled_time = request.data.get(
        "scheduled_time"
    )

    duration = request.data.get(
        "duration",
        60
    )

    # Create Scheduled Meeting
    meeting = Meeting.objects.create(

        host=request.user,
        title=title,
        description=description,
        meeting_type="scheduled",
        scheduled_time=scheduled_time,
        duration=duration

    )

    base_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    meeting.invite_link = f"{base_url}/meeting/{meeting.meeting_id}"
    meeting.save()

    serializer = MeetingSerializer(meeting)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )



# API 5 -----------------------------
# Upcoming Meetings
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_meetings(request):
    meetings = Meeting.objects.filter(
        host=request.user,
        scheduled_time__gte=timezone.now()
    ).order_by('scheduled_time')

    serializer = MeetingSerializer(
        meetings,
        many=True
    )

    return Response(serializer.data)



# API 6 -----------------------------
# Recent Meetings
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_meetings(request):

    meetings = Meeting.objects.filter(host=request.user).order_by(
        "-created_at"
    )[:10]

    serializer = MeetingSerializer(
        meetings,
        many=True
    )

    return Response(serializer.data)


# API 7 -----------------------------
# Delete Meeting
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_meeting(request, meeting_id):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id, host=request.user)
        meeting.delete()
        return Response(status=204)
    except Meeting.DoesNotExist:
        return Response({"error": "Not found"}, status=404)