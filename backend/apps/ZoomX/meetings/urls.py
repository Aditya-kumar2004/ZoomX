from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_meeting),
    path('schedule/', views.schedule_meeting),
    path('upcoming/', views.upcoming_meetings),
    path('recent/', views.recent_meetings),
    path('<str:meeting_id>/', views.get_meeting),
    path('<str:meeting_id>/join/', views.join_meeting),
    path('<str:meeting_id>/end/', views.end_meeting),
    path('<str:meeting_id>/delete/', views.delete_meeting),
    path('<str:meeting_id>/messages/', views.get_meeting_messages),
    path('<str:meeting_id>/participants/', views.get_meeting_participants),
]