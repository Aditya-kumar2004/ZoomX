"use client";

import { Video, Plus, Calendar, Monitor, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { meetingAPI } from "@/services/api";
import { Modal } from "@/components/ui/ZModal";
import { Input } from "@/components/ui/ZInput";
import { Button } from "@/components/ui/ZButton";
import { useAuth } from "@/hooks/useAuth";

export function ActionGrid() {
  const router = useRouter();
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinId, setJoinId] = useState("");
  const [joinName, setJoinName] = useState(user?.name || "");
  const [joinErr, setJoinErr] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const createInstant = async () => {
    setCreating(true);
    try {
      const meeting = await meetingAPI.createInstant();
      router.push(`/meeting/${meeting.meeting_id}`);
    } catch {
      const fallbackId = "demo-" + Math.random().toString(36).slice(2, 8);
      toast.success("Starting demo meeting");
      router.push(`/meeting/${fallbackId}`);
    } finally {
      setCreating(false);
    }
  };

  const doJoin = async () => {
    if (!joinId.trim()) {
      setJoinErr("Enter a meeting ID");
      return;
    }
    setJoining(true);
    setJoinErr(null);
    try {
      await meetingAPI.joinMeeting(joinId.trim(), joinName || "Guest");
      router.push(`/meeting/${joinId.trim()}`);
    } catch (e) {
      const status = (e as Error & { status?: number }).status;
      if (status === 404) setJoinErr("Meeting not found");
      else {
        // demo fallback
        router.push(`/meeting/${joinId.trim()}`);
      }
    } finally {
      setJoining(false);
    }
  };

  const cards = [
    {
      key: "new",
      title: "New Meeting",
      sub: "Start an instant meeting",
      icon: Video,
      primary: true,
      onClick: createInstant,
      loading: creating,
    },
    {
      key: "join",
      title: "Join Meeting",
      sub: "Enter an ID or link",
      icon: Plus,
      onClick: () => setJoinOpen(true),
    },
    {
      key: "schedule",
      title: "Schedule",
      sub: "Plan a future meeting",
      icon: Calendar,
      onClick: () => router.push("/schedule"),
    },
    {
      key: "share",
      title: "Share Screen",
      sub: "Start screen sharing",
      icon: Monitor,
      onClick: () => toast.info("This feature opens in a meeting room"),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.button
              key={c.key}
              onClick={c.onClick}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative text-left rounded-2xl p-6 border transition-all duration-200 group shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(45,111,255,0.15)] hover:-translate-y-0.5 ${
                c.primary
                  ? "bg-[#2D6FFF] border-[#2D6FFF] btn-glow"
                  : "bg-[#1A1A26] border-[#1E1E2E] hover:border-[#2D6FFF]/40"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  c.primary ? "bg-white/15" : "bg-[#2D6FFF]/15"
                }`}
              >
                {c.loading ? (
                  <Loader2 className={`w-6 h-6 animate-spin ${c.primary ? "text-white" : "text-[#2D6FFF]"}`} />
                ) : (
                  <Icon className={`w-6 h-6 ${c.primary ? "text-white" : "text-[#2D6FFF]"}`} />
                )}
              </div>
              <h3 className={`font-display text-lg font-bold mb-1 ${c.primary ? "text-white" : "text-[#F0F0FF]"}`}>
                {c.title}
              </h3>
              <p className={`text-sm ${c.primary ? "text-blue-100" : "text-[#8888AA]"}`}>{c.sub}</p>
            </motion.button>
          );
        })}
      </div>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join a Meeting">
        <div className="space-y-4">
          <Input
            label="Meeting ID"
            placeholder="abc-1234-xyz"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            error={joinErr || undefined}
          />
          <Input
            label="Your display name"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          />
          <Button fullWidth size="lg" onClick={doJoin} loading={joining}>
            Join Now
          </Button>
        </div>
      </Modal>
    </>
  );
}
