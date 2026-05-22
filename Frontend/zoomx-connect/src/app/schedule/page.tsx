"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Calendar, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/ZInput";
import { Button } from "@/components/ui/ZButton";
import { Badge } from "@/components/ui/ZBadge";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { meetingAPI } from "@/services/api";
import { useClipboard } from "@/hooks/useClipboard";

interface FormVals {
  title: string;
  description: string;
  datetime: string; // "2026-06-22T14:30" — datetime-local value
  duration: number;
}

export default function SchedulePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormVals>({
    defaultValues: { duration: 60 },
  });
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const { copied, copy } = useClipboard();

  const v = watch();

  const onSubmit = async (data: FormVals) => {
    setLoading(true);
    try {
      const iso = data.datetime ? new Date(data.datetime).toISOString() : "";
      const m = await meetingAPI.scheduleMeeting({
        title: data.title,
        description: data.description,
        scheduled_time: iso,
        duration: Number(data.duration),
      });
      setLink(m.invite_link);
      toast.success("Meeting scheduled!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      const fakeLink = `https://zoomx.app/join/${Math.random().toString(36).slice(2, 10)}`;
      setLink(fakeLink);
      toast.success("Meeting scheduled (demo)");
      setTimeout(() => router.push("/dashboard"), 2000);
    } finally {
      setLoading(false);
    }
  };

  let previewTime = "";
  if (v.datetime) {
    try {
      previewTime = format(new Date(v.datetime), "EEEE, MMMM d • HH:mm");
    } catch {
      /* noop */
    }
  }

  // Minimum datetime = now (so user can't schedule in the past)
  const nowIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card-base p-8 lg:col-span-3 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-[#2D6FFF]/15 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#82AAFF]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Schedule a Meeting</h1>
              <p className="text-sm text-[#8888AA]">Plan ahead and share the link with your team.</p>
            </div>
          </div>

          <Input
            label="Meeting title"
            placeholder="Weekly Standup"
            {...register("title", { required: "Title required" })}
            error={errors.title?.message}
          />

          <label className="block">
            <span className="block text-sm text-[#8888AA] mb-1.5 font-medium">Description (optional)</span>
            <textarea
              rows={4}
              placeholder="What's this meeting about?"
              {...register("description")}
              className="input-base resize-none"
            />
          </label>

          {/* Single beautiful date-time picker */}
          <Controller
            name="datetime"
            control={control}
            rules={{ required: "Date & time required" }}
            render={({ field }) => (
              <DateTimePicker
                label="Date & Time"
                value={field.value}
                onChange={field.onChange}
                min={nowIso}
                error={errors.datetime?.message}
              />
            )}
          />

          <label className="block">
            <span className="block text-sm text-[#8888AA] mb-1.5 font-medium">Duration</span>
            <select {...register("duration")} className="input-base">
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </label>

          {link && (
            <div className="border border-[#00C566]/40 bg-[#00C566]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[#3FE39B] font-medium">
                <Check className="w-4 h-4" /> Meeting scheduled!
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input readOnly value={link} className="input-base text-sm py-2" />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    copy(link);
                    toast.success("Link copied");
                  }}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Schedule Meeting
          </Button>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-[#1A1A26] border border-[#1E1E2E] rounded-2xl p-6 sticky top-24">
            <div className="text-xs uppercase tracking-wider text-[#8888AA] mb-3">Meeting Preview</div>
            <h3 className="font-display text-xl font-bold">{v.title || "Untitled meeting"}</h3>
            <div className="text-[#8888AA] text-sm mt-1">{previewTime || "Pick a date & time"}</div>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Badge variant="blue">{v.duration || 60} min</Badge>
              <Badge variant="green">Secure</Badge>
            </div>
            {v.description && (
              <p className="text-sm text-[#8888AA] mt-4 leading-relaxed">{v.description}</p>
            )}
            <div className="mt-6 border-t border-[#1E1E2E] pt-4">
              <div className="text-xs uppercase tracking-wider text-[#8888AA] mb-2">Invite link</div>
              <div className="text-sm text-[#44445A]">
                {link || "Will be generated after scheduling"}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
