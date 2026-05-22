import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { Users, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Meeting } from "@/types";
import { Button } from "@/components/ui/ZButton";
import { Badge } from "@/components/ui/ZBadge";
import { useClipboard } from "@/hooks/useClipboard";
import { meetingAPI } from "@/services/api";

export function MeetingCard({
  meeting,
  variant,
  onDelete,
}: {
  meeting: Meeting;
  variant: "upcoming" | "recent";
  onDelete?: () => void;
}) {
  const { copied, copy } = useClipboard();
  const time = meeting.scheduled_time ? new Date(meeting.scheduled_time) : new Date(meeting.created_at);

  const onCopy = () => {
    copy(meeting.invite_link);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await meetingAPI.deleteMeeting(meeting.meeting_id);
      toast.success("Meeting deleted successfully");
      if (onDelete) {
        onDelete();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete meeting");
    }
  };

  return (
    <div className="group bg-[#111118] border border-[#1E1E2E] hover:border-[#2D6FFF]/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 transition">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[#2D6FFF] shadow-[0_0_10px_rgba(45,111,255,0.7)] shrink-0" />
        <div className="min-w-0 flex-1">
          <h4 className="font-display font-semibold text-base truncate">{meeting.title}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#8888AA]">
            <span>
              {variant === "upcoming"
                ? format(time, "EEE, MMM d • HH:mm")
                : formatDistanceToNow(time, { addSuffix: true })}
            </span>
            <Badge variant="gray">
              <Users className="w-3 h-3" /> {meeting.participants?.length || 0}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {variant === "upcoming" && (
          <Link href={`/meeting/${meeting.meeting_id}`}>
            <Button size="sm" variant="primary">Start</Button>
          </Link>
        )}
        <Button size="sm" variant="secondary" onClick={onCopy} leftIcon={copied ? <Check className="w-4 h-4 text-[#00C566]" /> : <Copy className="w-4 h-4" />}>
          {copied ? "Copied" : "Copy Link"}
        </Button>
        {variant === "recent" && (
          <button
            onClick={handleDelete}
            aria-label="Delete"
            className="p-2 rounded-lg text-[#FF3B55] hover:bg-[#FF3B55]/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

