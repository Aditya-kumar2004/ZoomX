from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.db.models import Count, Max, Prefetch, Q
from django.db.models.functions import Coalesce, Greatest
from .models import Meeting, Participant, ChatMessage

class ParticipantInline(admin.TabularInline):
    model = Participant
    extra = 0
    fields = (
        'user', 
        'display_name', 
        'host_badge', 
        'is_host', 
        'is_active', 
        'joined_at', 
        'left_at', 
        'reconnect_status', 
        'session_status'
    )
    readonly_fields = (
        'host_badge', 
        'is_host', 
        'is_active', 
        'joined_at', 
        'left_at', 
        'reconnect_status', 
        'session_status'
    )
    raw_id_fields = ('user',)
    ordering = ('-is_host', '-is_active', '-joined_at')
    verbose_name = "Active Participant"
    verbose_name_plural = "Meeting Participant Sessions"

    def host_badge(self, obj):
        if obj.is_host:
            return mark_safe('<span style="background-color: #ffd700; color: #000; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85em; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.15);">👑 HOST</span>')
        return mark_safe('<span style="background-color: #e0e0e0; color: #555; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; display: inline-block;">GUEST</span>')
    host_badge.short_description = "Role Badge"

    def reconnect_status(self, obj):
        if obj.reconnect_count > 0:
            return format_html('<span style="color: #e65100; font-weight: bold; font-size: 0.9em; background-color: #ffe0b2; padding: 2px 6px; border-radius: 4px;">🔄 Reconnected ({}x)</span>', obj.reconnect_count)
        return mark_safe('<span style="color: #757575; font-size: 0.9em;">First Connection</span>')
    reconnect_status.short_description = "Reconnects"

    def session_status(self, obj):
        if obj.is_active:
            return mark_safe('<span style="color: #2e7d32; font-weight: bold; font-size: 0.9em; background-color: #e8f5e9; padding: 2px 6px; border-radius: 4px;">● Connected</span>')
        return mark_safe('<span style="color: #c62828; font-weight: bold; font-size: 0.9em; background-color: #ffebee; padding: 2px 6px; border-radius: 4px;">■ Offline</span>')
    session_status.short_description = "Socket Status"


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    fields = ('sender', 'sender_username', 'message_log', 'message_type', 'is_deleted', 'created_at')
    readonly_fields = ('sender_username', 'message_log', 'created_at')
    raw_id_fields = ('sender',)
    ordering = ('created_at',)
    verbose_name = "Chat Log"
    verbose_name_plural = "Meeting Chat Conversations"

    def sender_username(self, obj):
        return obj.sender.username if obj.sender else obj.sender_name
    sender_username.short_description = "Username"

    def message_log(self, obj):
        sender = obj.sender.username if obj.sender else obj.sender_name
        time_str = obj.created_at.strftime("%H:%M:%S")
        
        type_label = ""
        if obj.message_type == 'system':
            bg_color = "#e3f2fd"
            border_color = "#2196f3"
            type_label = "[SYSTEM] "
        elif obj.message_type == 'control':
            bg_color = "#ffebee"
            border_color = "#f44336"
            type_label = "[CONTROL] "
        else:
            bg_color = "#f9f9f9"
            border_color = "#cfd8dc"
            
        msg_text = obj.message
        if obj.is_deleted:
            msg_text = format_html('<i style="color: #9e9e9e;">This message was deleted by administrator</i>')
            
        return format_html(
            '<div style="background-color: {}; border-left: 4px solid {}; padding: 8px 12px; margin: 4px 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">'
            '<span style="color: #546e7a; font-size: 0.85em; font-weight: bold;">{} @ {}</span><br/>'
            '<span style="font-size: 1.0em; color: #263238; line-height: 1.4;">{}{}</span>'
            '</div>',
            bg_color, border_color, sender, time_str, type_label, msg_text
        )
    message_log.short_description = "Message Log"


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = (
        'meeting_id', 
        'meeting_code', 
        'host_link', 
        'participant_count', 
        'active_participant_count', 
        'message_count', 
        'meeting_status', 
        'is_deleted',
        'created_at', 
        'last_activity_time'
    )
    list_filter = ('is_active', 'is_deleted', 'meeting_type', 'created_at')
    search_fields = ('meeting_id', 'meeting_code', 'title', 'host__username', 'host__email')
    inlines = [ParticipantInline, ChatMessageInline]
    
    readonly_fields = (
        'meeting_id', 
        'meeting_code', 
        'invite_link', 
        'meeting_status', 
        'host_details', 
        'participant_count', 
        'active_participant_count', 
        'message_count', 
        'created_at', 
        'last_activity_time'
    )
    
    fieldsets = (
        ('Meeting Overview', {
            'fields': (
                'meeting_id',
                'meeting_code',
                'title',
                'meeting_status',
                'created_at',
                'last_activity_time',
            )
        }),
        ('Host Details', {
            'fields': (
                'host',
                'host_details',
            )
        }),
        ('Statistics & Metrics', {
            'fields': (
                'participant_count',
                'active_participant_count',
                'message_count',
            )
        }),
        ('Additional Configuration', {
            'fields': (
                'description',
                'meeting_type',
                'invite_link',
                'scheduled_time',
                'duration',
                'is_active',
                'is_deleted',
            ),
            'classes': ('collapse',),
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.select_related('host')
        
        # Optimize Inline Prefetches
        participant_prefetch = Prefetch(
            'participant_sessions',
            queryset=Participant.objects.select_related('user').order_by('-is_host', '-is_active', '-joined_at')
        )
        chat_prefetch = Prefetch(
            'chat_messages',
            queryset=ChatMessage.objects.select_related('sender').order_by('created_at')
        )
        qs = qs.prefetch_related(participant_prefetch, chat_prefetch)
        
        # Annotate counts and activity times
        qs = qs.annotate(
            annotated_participant_count=Count('participant_sessions', distinct=True),
            annotated_active_participant_count=Count(
                'participant_sessions',
                filter=Q(participant_sessions__is_active=True),
                distinct=True
            ),
            annotated_message_count=Count('chat_messages', distinct=True),
            max_joined_at=Max('participant_sessions__joined_at'),
            max_message_at=Max('chat_messages__created_at'),
        )
        
        # Use Coalesce and Greatest for last activity time calculation
        qs = qs.annotate(
            last_activity=Greatest(
                'created_at',
                Coalesce('max_joined_at', 'created_at'),
                Coalesce('max_message_at', 'created_at')
            )
        )
        
        return qs

    def host_link(self, obj):
        if obj.host:
            url = reverse("admin:auth_user_change", args=[obj.host.id])
            return format_html('<a href="{}">{}</a>', url, obj.host.username)
        return "No Host"
    host_link.short_description = "Host"
    host_link.admin_order_field = 'host__username'

    def host_details(self, obj):
        if obj.host:
            return f"Username: {obj.host.username} | Email: {obj.host.email} | Name: {obj.host.get_full_name()}"
        return "No Host assigned"
    host_details.short_description = "Host Connection Details"

    def participant_count(self, obj):
        val = getattr(obj, 'annotated_participant_count', None)
        if val is None:
            val = obj.participant_sessions.count()
        return val
    participant_count.short_description = "Total Participants"
    participant_count.admin_order_field = 'annotated_participant_count'

    def active_participant_count(self, obj):
        val = getattr(obj, 'annotated_active_participant_count', None)
        if val is None:
            val = obj.participant_sessions.filter(is_active=True).count()
        return val
    active_participant_count.short_description = "Active Participants"
    active_participant_count.admin_order_field = 'annotated_active_participant_count'

    def message_count(self, obj):
        val = getattr(obj, 'annotated_message_count', None)
        if val is None:
            val = obj.chat_messages.count()
        return val
    message_count.short_description = "Total Messages"
    message_count.admin_order_field = 'annotated_message_count'

    def meeting_status(self, obj):
        if obj.is_active:
            return mark_safe('<span style="color: #2e7d32; font-weight: bold; font-size: 1.05em;">● Active</span>')
        return mark_safe('<span style="color: #c62828; font-weight: bold; font-size: 1.05em;">■ Inactive</span>')
    meeting_status.short_description = "Meeting Status"
    meeting_status.admin_order_field = 'is_active'

    def last_activity_time(self, obj):
        val = getattr(obj, 'last_activity', None)
        if not val:
            max_joined = obj.participant_sessions.aggregate(m=Max('joined_at'))['m']
            max_msg = obj.chat_messages.aggregate(m=Max('created_at'))['m']
            dates = [obj.created_at]
            if max_joined:
                dates.append(max_joined)
            if max_msg:
                dates.append(max_msg)
            val = max(dates)
        return val.strftime("%Y-%m-%d %H:%M:%S")
    last_activity_time.short_description = "Last Activity"
    last_activity_time.admin_order_field = 'last_activity'


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'display_name', 'user', 'is_host', 'is_active', 'joined_at', 'left_at')
    list_filter = ('meeting', 'is_active', 'is_host', 'joined_at')
    ordering = ('meeting', '-joined_at')
    search_fields = ('display_name', 'meeting__meeting_id', 'meeting__meeting_code', 'user__username', 'user__email')
    raw_id_fields = ('user',)

    def has_module_permission(self, request):
        return False


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('meeting', 'sender_name', 'sender', 'message', 'is_deleted', 'created_at')
    list_filter = ('meeting', 'is_deleted', 'created_at')
    ordering = ('meeting', 'created_at')
    search_fields = ('sender_name', 'sender__username', 'sender__email', 'message', 'meeting__meeting_id', 'meeting__meeting_code')

    def has_module_permission(self, request):
        return False
