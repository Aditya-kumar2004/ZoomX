"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { getAllRecordings, deleteRecording, type Recording } from "@/utils/indexedDB";
import { formatDuration } from "@/utils/helpers";
import { toast } from "sonner";
import { Play, Download, Trash2, Film, Calendar, Clock } from "lucide-react";
import { Modal } from "@/components/ui/ZModal";
import { Button } from "@/components/ui/ZButton";

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  // Playback Modal State
  const [activeRecording, setActiveRecording] = useState<Recording | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadRecordings = async () => {
    try {
      const list = await getAllRecordings();
      setRecordings(list);
    } catch (err) {
      console.error("Failed to load recordings:", err);
      toast.error("Failed to load recordings database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const handlePlay = (rec: Recording) => {
    const url = URL.createObjectURL(rec.blob);
    setVideoUrl(url);
    setActiveRecording(rec);
  };

  const handleClosePlayer = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl("");
    }
    setActiveRecording(null);
  };

  const handleDownload = (rec: Recording) => {
    const url = URL.createObjectURL(rec.blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date(rec.timestamp).toISOString().slice(0, 10);
    a.download = `ZoomX_Recording_${rec.title.replace(/\s+/g, "_")}_${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download started");
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteRecording(deleteId);
      toast.success("Recording deleted");
      setDeleteId(null);
      loadRecordings();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete recording");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Film className="w-8 h-8 text-[#2D6FFF]" /> Recordings
          </h1>
          <p className="text-[#8888AA] mt-1">Access all your locally saved meeting recordings.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2D6FFF]"></div>
            <p className="text-[#8888AA] mt-4">Loading recordings...</p>
          </div>
        ) : recordings.length === 0 ? (
          <div className="card-base bg-[#0A0A0F]/70 border border-[#1E1E2E] backdrop-blur-xl p-12 text-center rounded-3xl max-w-2xl mx-auto">
            <Film className="w-16 h-16 text-[#8888AA]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No recordings found</h2>
            <p className="text-[#8888AA] mb-6 max-w-sm mx-auto">
              Any meeting you record will appear here. To start a recording, click the "Record" button inside a live meeting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec) => {
              const formattedDate = new Date(rec.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedTime = new Date(rec.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={rec.id}
                  className="card-base bg-[#0A0A0F]/70 border border-[#1E1E2E] hover:border-[#2E2E3E] transition p-5 rounded-2xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-full aspect-video rounded-xl bg-[#111118] border border-[#1E1E2E] relative flex items-center justify-center overflow-hidden group">
                      <Film className="w-8 h-8 text-[#8888AA]/40 absolute group-hover:scale-110 transition duration-300" />
                      <button
                        onClick={() => handlePlay(rec)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 z-10"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#2D6FFF] text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-lg line-clamp-1">{rec.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#8888AA] mt-1.5 font-mono">
                        <span>ID: {rec.meetingId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#1E1E2E] pt-4 flex flex-col gap-3">
                    <div className="flex justify-between text-xs text-[#8888AA]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate} at {formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDuration(rec.duration)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePlay(rec)}
                        className="flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Play
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(rec)}
                        className="flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                      <button
                        onClick={() => setDeleteId(rec.id)}
                        className="w-9 h-9 rounded-lg bg-[#FF3B55]/10 hover:bg-[#FF3B55]/20 text-[#FF8093] flex items-center justify-center transition"
                        title="Delete recording"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Video Player Modal */}
        <Modal
          open={activeRecording !== null}
          onClose={handleClosePlayer}
          title={activeRecording?.title || "Recording Playback"}
          widthClass="w-[800px]"
        >
          <div className="w-full aspect-video rounded-2xl bg-black border border-[#1E1E2E] overflow-hidden relative mb-4">
            {videoUrl && (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="flex justify-between items-center text-sm text-[#8888AA] font-mono">
            <span>Meeting ID: {activeRecording?.meetingId}</span>
            <span>Duration: {activeRecording ? formatDuration(activeRecording.duration) : ""}</span>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            {activeRecording && (
              <Button variant="secondary" onClick={() => handleDownload(activeRecording)}>
                <Download className="w-4 h-4 mr-2" /> Download file (.webm)
              </Button>
            )}
            <Button onClick={handleClosePlayer}>Close</Button>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          title="Delete Recording?"
        >
          <p className="text-[#8888AA] mb-6">
            Are you sure you want to delete this recording? This action is permanent and cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
