import MeetingRoomClient from "./MeetingRoomClient";

// Force Next.js App Router to skip static generation at build time for this dynamic real-time room
export const dynamic = "force-dynamic";

export default function MeetingPage() {
  return <MeetingRoomClient />;
}
