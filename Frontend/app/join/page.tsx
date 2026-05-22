"use client";

import { useState } from "react";
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/ZInput";
import { Button } from "@/components/ui/ZButton";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import { meetingAPI } from "@/services/api";
import { parseMeetingId } from "@/utils/helpers";

export default function JoinPage() {
  useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [id, setId] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const meetingId = parseMeetingId(id);
    if (!meetingId) {
      setError("Enter a valid meeting ID or link");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await meetingAPI.joinMeeting(meetingId, name || "Guest");
      router.push(`/meeting/${meetingId}`);
    } catch (err) {
      const status = (err as Error & { status?: number }).status;
      if (status === 404) setError("Meeting not found. Check the ID.");
      else router.push(`/meeting/${meetingId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8888AA] hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="card-base p-8 md:p-10 rounded-3xl">
          <div className="w-12 h-12 rounded-xl bg-[#2D6FFF]/15 flex items-center justify-center mb-5">
            <Video className="w-6 h-6 text-[#82AAFF]" />
          </div>
          <h1 className="font-display text-3xl font-bold">Join a Meeting</h1>
          <p className="text-[#8888AA] mt-1 mb-6">Enter the meeting ID or paste an invite link</p>

          <form className="space-y-4" onSubmit={submit}>
            <Input
              label="Meeting ID or link"
              placeholder="abc-1234-xyz or https://zoomx.app/join/…"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
            />
            <Input
              label="Display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <div className="border border-[#FF3B55]/40 bg-[#FF3B55]/10 text-[#FF8093] rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? "Joining…" : "Join Meeting"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
