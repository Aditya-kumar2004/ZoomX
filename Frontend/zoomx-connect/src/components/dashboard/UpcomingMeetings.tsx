import { Calendar } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/ZLoader";
import { Button } from "@/components/ui/ZButton";
import { MeetingCard } from "./MeetingCard";
import type { Meeting } from "@/types";

export function UpcomingMeetings({ meetings, loading }: { meetings: Meeting[]; loading: boolean }) {
  return (
    <section id="upcoming">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold">Upcoming Meetings</h2>
        <Link href="/schedule">
          <Button size="sm" variant="ghost">Schedule new</Button>
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : meetings.length === 0 ? (
        <div className="card-base p-10 text-center">
          <Calendar className="w-10 h-10 mx-auto text-[#44445A] mb-3" />
          <p className="text-[#8888AA] mb-4">No upcoming meetings</p>
          <Link href="/schedule"><Button>Schedule Meeting</Button></Link>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => <MeetingCard key={m.id} meeting={m} variant="upcoming" />)}
        </div>
      )}
    </section>
  );
}
