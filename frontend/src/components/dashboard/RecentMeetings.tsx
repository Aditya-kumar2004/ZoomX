import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/ZLoader";
import { MeetingCard } from "./MeetingCard";
import type { Meeting } from "@/types";

export function RecentMeetings({
  meetings,
  loading,
  onDelete,
}: {
  meetings: Meeting[];
  loading: boolean;
  onDelete?: () => void;
}) {
  return (
    <section id="recent">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold">Recent Meetings</h2>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : meetings.length === 0 ? (
        <div className="card-base p-10 text-center">
          <History className="w-10 h-10 mx-auto text-[#44445A] mb-3" />
          <p className="text-[#8888AA]">No recent meetings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} variant="recent" onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
