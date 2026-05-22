"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { meetingAPI, mockMeetings } from "@/services/api";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";

import { VideoGrid } from "@/components/meeting/VideoGrid";
import type { VideoTileData } from "@/components/meeting/VideoTile";
import { ControlBar } from "@/components/meeting/ControlBar";
import { ParticipantPanel } from "@/components/meeting/ParticipantPanel";
import { ChatPanel } from "@/components/meeting/ChatPanel";
import EmojiReaction from "@/components/meeting/EmojiReaction";
import { useWebRTC } from "@/hooks/useWebRTC";
import { formatDuration } from "@/utils/helpers";
import { Button } from "@/components/ui/ZButton";
import type { Meeting } from "@/types";
import { saveRecording } from "@/utils/indexedDB";
import { ShieldCheck, Circle, Mic, MicOff, Video, VideoOff, Share2, ChevronDown, Copy, Check, Lock, Mail } from "lucide-react";

// ─── STUNNING WAITING ROOM SCREEN FOR GUESTS ─────────────────────────────────
function WaitingRoomScreen({
  userName,
  title,
  muted,
  cameraOff,
  onToggleMute,
  onToggleCamera,
  onLeave,
  localStream,
}: {
  userName: string;
  title?: string;
  muted: boolean;
  cameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onLeave: () => void;
  localStream: MediaStream | null;
}) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080C] via-[#0D0D15] to-[#12121F] flex items-center justify-center p-6 text-[#F0F0FF] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#FF9500]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="bg-[#12121C]/80 backdrop-blur-xl border border-[#232336] rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl relative z-10 overflow-hidden">
        {/* Pulsing indicator line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FF9500] via-[#FFB74D] to-[#FF9500]" />

        <div className="flex flex-col md:flex-row gap-8 items-center text-left">
          {/* Left: Video Preview */}
          <div className="w-full md:w-1/2 aspect-video bg-[#181829] border border-[#2D2D3D] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner">
            {!cameraOff && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#222233] border border-[#33334A] flex items-center justify-center text-3xl font-extrabold text-white shrink-0">
                {userName[0].toUpperCase()}
              </div>
            )}
            
            {/* Quick Camera/Mic toggle in corner */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-25">
              <button
                onClick={onToggleMute}
                className={`p-2 rounded-full transition-all duration-200 ${
                  muted ? "bg-[#FF3B55] text-white" : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title={muted ? "Unmute Mic" : "Mute Mic"}
              >
                {muted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                onClick={onToggleCamera}
                className={`p-2 rounded-full transition-all duration-200 ${
                  cameraOff ? "bg-[#FF3B55] text-white" : "bg-white/10 text-white hover:bg-white/20"
                }`}
                title={cameraOff ? "Start Camera" : "Stop Camera"}
              >
                {cameraOff ? <VideoOff size={16} /> : <Video size={16} />}
              </button>
            </div>
          </div>

          {/* Right: Status and Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-ping shrink-0" />
              <span className="text-xs font-semibold text-[#FF9500] uppercase tracking-widest font-mono">
                Lobby Waiting Area
              </span>
            </div>

            <h1 className="font-display text-2xl font-extrabold text-white mb-2 tracking-tight font-sora leading-tight">
              Host Admission Required
            </h1>
            
            <p className="text-sm text-[#8888AA] leading-relaxed mb-6 font-inter">
              Hello, <span className="text-white font-semibold">{userName}</span>! You have successfully connected to the meeting lobby. The host is being notified to let you in shortly.
            </p>

            <div className="bg-[#181829] border border-[#24243B] rounded-xl p-4 mb-6 flex flex-col gap-2 font-mono text-[11px] text-[#8888AA]">
              <div className="flex justify-between items-center">
                <span>Meeting Title:</span>
                <span className="text-white font-medium truncate max-w-[130px]" title={title}>{title || "ZoomX Session"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Signaling Server:</span>
                <span className="text-[#00C566] font-semibold">CONNECTED</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onLeave}
                className="flex-1 py-3 bg-[#2D2D3D] hover:bg-[#3D3D50] text-white rounded-xl text-sm font-semibold transition"
              >
                Cancel / Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUNNING SESSION ENDED SCREEN ───────────────────────────────────────────
function MeetingEndedScreen({ title }: { title?: string }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push("/dashboard");
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#08080C] via-[#0D0D15] to-[#12121F] flex items-center justify-center p-6 text-[#F0F0FF] relative overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#2D6FFF]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#FF3B55]/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="bg-[#12121C]/75 backdrop-blur-xl border border-[#232336] rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl relative z-10 overflow-hidden">
        {/* Top gold line accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2D6FFF] via-[#7B5CFF] to-[#FF3B55]" />
        
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF3B55]/20 to-[#FF3B55]/5 border border-[#FF3B55]/40 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#FF3B55]/10 animate-bounce">
          <svg className="w-10 h-10 text-[#FF3B55]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-extrabold text-white mb-2 tracking-tight font-sora">
          Meeting Ended
        </h1>
        <p className="text-[#8888AA] text-sm mb-6 font-medium">
          The session <span className="text-[#2D6FFF] font-semibold">"{title || "ZoomX Meeting"}"</span> has been closed by the host.
        </p>

        <div className="bg-[#181829] border border-[#24243B] rounded-2xl p-6 mb-8 relative overflow-hidden">
          <p className="text-sm text-[#AAAAEE] leading-relaxed mb-4 font-inter">
            Thank you for participating! We hope you enjoyed our crystal-clear audio, dynamic video grid, and lag-free collaboration.
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00C566] animate-pulse" />
            <span className="text-xs text-[#00C566] font-semibold tracking-wider font-mono">
              Safe & Encrypted Session Terminated
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Circular Countdown Progress */}
          <div className="flex items-center justify-center gap-2 text-sm text-[#8888AA]">
            <span>Redirecting to your dashboard in</span>
            <span className="font-bold text-white bg-[#222238] border border-[#333355] px-2.5 py-1 rounded-lg text-sm font-mono tracking-tight">
              {secondsLeft}s
            </span>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3.5 bg-gradient-to-r from-[#2D6FFF] to-[#5E97FF] hover:from-[#235BDF] hover:to-[#4D88FF] text-white rounded-xl font-semibold shadow-lg shadow-[#2D6FFF]/25 hover:shadow-[#2D6FFF]/35 transition-all duration-300 font-sora"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MEETING ROOM COMPONENT ─────────────────────────────────────────────
export default function MeetingRoom() {
  useRequireAuth();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const meetingId = meeting?.meeting_id || id;
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Determine if current user is the host
  const isHost = !!(meeting?.host_email && user?.email && meeting.host_email === user.email);

  const [elapsed, setElapsed] = useState(0);
  const [formattedTimer, setFormattedTimer] = useState("00:00:00");
  useEffect(() => {
    setFormattedTimer(formatDuration(elapsed));
  }, [elapsed]);

  const [reaction, setReaction] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);
  const userName = user?.name || "Guest";


  // Share Panel States & Actions
  const [shareOpen, setShareOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvitation, setCopiedInvitation] = useState(false);
  const sharePanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareOpen && sharePanelRef.current && !sharePanelRef.current.contains(event.target as Node)) {
        setShareOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);

  const getJoinLink = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/meeting/${meetingId}`;
    }
    return `/meeting/${meetingId}`;
  };

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId);
    setCopiedId(true);
    toast.success("Meeting ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyJoinLink = () => {
    navigator.clipboard.writeText(getJoinLink());
    setCopiedLink(true);
    toast.success("Join link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyInvitation = () => {
    const joinLink = getJoinLink();
    const invitationText = `You've been invited to a secure ZoomX Video Meeting.

Meeting Title: ${meeting?.title || "ZoomX Session"}
Meeting ID: ${meetingId}
Join Link: ${joinLink}

Secure & Encrypted collaboration powered by ZoomX.`;

    navigator.clipboard.writeText(invitationText);
    setCopiedInvitation(true);
    toast.success("Invitation template copied to clipboard!");
    setTimeout(() => setCopiedInvitation(false), 2000);
  };

  // WebRTC Signaling Hook Call
  const {
    remotePeers,
    chatMessages,
    sendChat,
    wsConnected,
    replaceVideoTrack,
    admitted,
    pendingAdmissions,
    meetingEnded,
    admitPeer,
    denyPeer,
    admitAll,
    kickPeer,
    muteParticipant,
    unmuteParticipant,
    stopParticipantVideo,
    endMeetingForAll,
  } = useWebRTC({
    meetingId: meetingId as string,
    userName,
    localStream,
    muted,
    cameraOff,
    onRemoteReaction: (emoji) => onReaction(emoji),
    isHost,
    onMutedByHost: () => {
      setMuted(true);
      toast.info("The host has muted your microphone.");
    },
    onUnmutedByHost: () => {
      setMuted(false);
      toast.success("The host has unmuted your microphone.");
    },
    onCameraOffByHost: () => {
      setCameraOff(true);
      toast.info("The host has turned off your camera.");
    },
    onKicked: () => {
      toast.error("You have been removed from the meeting.");
      router.push("/dashboard");
    },
    onMeetingEnded: () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }
      setIsSharing(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }

    },
  });

  const [isSharing, setIsSharing] = useState(false);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Recording State & Refs
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number | null>(null);

  // Interactive Toast alert for host when a guest is in waiting room
  const lastPendingCountRef = useRef(0);
  useEffect(() => {
    if (isHost && pendingAdmissions.length > lastPendingCountRef.current) {
      const newest = pendingAdmissions[pendingAdmissions.length - 1];
      toast.info(`${newest.name} is waiting in the lobby.`, {
        action: {
          label: "Admit",
          onClick: () => admitPeer(newest.peerId),
        },
        duration: 8000,
      });
    }
    lastPendingCountRef.current = pendingAdmissions.length;
  }, [isHost, pendingAdmissions, admitPeer]);

  // Load defaults from settings on mount
  useEffect(() => {
    const camDefault = localStorage.getItem("zoomx_camera_enabled_by_default");
    const micDefault = localStorage.getItem("zoomx_mic_enabled_by_default");

    if (camDefault === "false") setCameraOff(true);
    if (micDefault === "false") setMuted(true);
  }, []);

  // Suppress Next.js Developer Overlay for NotAllowedError / Permission Denied error logs
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const isPermissionError = args.some(
        (arg) =>
          arg &&
          (arg.name === "NotAllowedError" ||
            arg.message?.includes("Permission denied") ||
            String(arg).includes("NotAllowedError") ||
            String(arg).includes("Permission denied"))
      );
      if (isPermissionError) {
        console.warn("Suppressed Dev Overlay Console Error:", ...args);
        return;
      }
      originalConsoleError(...args);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason &&
        (reason.name === "NotAllowedError" ||
          reason.message?.includes("Permission denied") ||
          String(reason).includes("NotAllowedError") ||
          String(reason).includes("Permission denied"))
      ) {
        console.warn("Suppressed Dev Overlay Unhandled Rejection:", reason);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      if (
        error &&
        (error.name === "NotAllowedError" ||
          error.message?.includes("Permission denied") ||
          String(error).includes("NotAllowedError") ||
          String(error).includes("Permission denied"))
      ) {
        console.warn("Suppressed Dev Overlay Error Event:", error);
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection, true);
    window.addEventListener("error", handleError, true);

    return () => {
      console.error = originalConsoleError;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection, true);
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const m = await meetingAPI.getMeeting(id);
        if (alive) setMeeting(m);
      } catch (e) {
        const status = (e as Error & { status?: number }).status;
        if (status === 404) {
          if (alive) setNotFound(true);
        } else {
          // demo fallback
          if (alive)
            setMeeting({
              ...mockMeetings.upcoming[0],
              meeting_id: id,
              title: "ZoomX Meeting",
            });
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);



  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function initMedia() {
      const preferredCamId = localStorage.getItem("zoomx_preferred_camera_id") || undefined;
      const preferredMicId = localStorage.getItem("zoomx_preferred_mic_id") || undefined;
      const initialCamOff = localStorage.getItem("zoomx_camera_enabled_by_default") === "false";
      const initialMuted = localStorage.getItem("zoomx_mic_enabled_by_default") === "false";

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: preferredCamId ? { exact: preferredCamId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: preferredMicId ? { deviceId: { exact: preferredMicId } } : true,
        });
        activeStream = stream;
        setLocalStream(stream);

        // Apply initial enabled states
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !initialMuted;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = !initialCamOff;
        });
      } catch (err) {
        if ((err as Error)?.name === "NotAllowedError") {
          console.warn("Combined media access denied by user, trying audio fallback.");
        } else {
          console.warn("Combined media access failed, trying audio fallback:", err);
        }
        // Fallback 1: Try audio only
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: preferredMicId ? { deviceId: { exact: preferredMicId } } : true,
          });
          activeStream = audioStream;
          setLocalStream(audioStream);
          setCameraOff(true);
          audioStream.getAudioTracks().forEach((track) => {
            track.enabled = !initialMuted;
          });
        } catch (audioErr) {
          if ((audioErr as Error)?.name === "NotAllowedError") {
            console.warn("Audio access denied by user, trying video fallback.");
          } else {
            console.warn("Audio fallback failed, trying video fallback:", audioErr);
          }
          // Fallback 2: Try video only
          try {
            const videoStream = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: preferredCamId ? { exact: preferredCamId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
              },
            });
            activeStream = videoStream;
            setLocalStream(videoStream);
            setMuted(true);
            videoStream.getVideoTracks().forEach((track) => {
              track.enabled = !initialCamOff;
            });
          } catch (videoErr) {
            if ((videoErr as Error)?.name === "NotAllowedError") {
              console.warn("Camera and microphone permissions were denied by the user.");
            } else {
              console.warn("All media fallbacks failed:", videoErr);
            }
            toast.error("Could not access camera/microphone. Please check permissions.");
            setCameraOff(true);
            setMuted(true);
          }
        }
      }
    }
    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
  }, [muted, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !cameraOff;
      });
    }
  }, [cameraOff, localStream]);

  // Clean up running recordings on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!localStream) {
      toast.error("No active video/audio stream to record.");
      return;
    }
    recordedChunksRef.current = [];
    recordingStartTimeRef.current = Date.now();
    try {
      const mimeTypes = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
      let selectedMime = "";
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      const options = selectedMime ? { mimeType: selectedMime } : undefined;
      const recorder = new MediaRecorder(localStream, options);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const startTime = recordingStartTimeRef.current || Date.now();
        const recDuration = Math.round((Date.now() - startTime) / 1000);

        try {
          await saveRecording({
            meetingId: meeting?.meeting_id || id,
            title: meeting?.title || "ZoomX Meeting",
            blob: blob,
            timestamp: new Date().toISOString(),
            duration: recDuration || 1,
          });
          toast.success("Recording saved successfully! View it in your Recordings dashboard.");
        } catch (err) {
          console.error("Failed to save recording:", err);
          toast.error("Error saving recording file.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // collect 1s chunks
      setIsRecording(true);
      toast.success("Recording started");
    } catch (err) {
      console.error("Error starting MediaRecorder:", err);
      toast.error("Recording not supported or failed to start.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleEndMeeting = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    setIsSharing(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    endMeetingForAll();
  };

  // Automatically terminate all active media streams (camera, microphone, screen sharing)
  // and recording sessions immediately when the meeting ends.
  useEffect(() => {
    if (meetingEnded) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
        setLocalStream(null);
      }
      setIsSharing(false);
      if (isRecording) {
        stopRecording();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingEnded, isRecording]);


  // Robust screen share and local stream cleanup on unmount
  // Uses refs (not state) so this fires once with the latest values no matter when the component tears down
  useEffect(() => {
    return () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // ── Screen Share ────────────────────────────────────────────────────────
  const toggleShare = async () => {
    if (isSharing) {
      // Stop existing screen share
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setIsSharing(false);

      // Replace video track back with local camera video track
      const cameraTrack = localStream?.getVideoTracks()[0] || null;
      replaceVideoTrack(cameraTrack);

      toast.success("Screen sharing stopped");
      return;
    }
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });
      screenStreamRef.current = screenStream;
      setIsSharing(true);

      // Replace video track with screen sharing track
      const screenTrack = screenStream.getVideoTracks()[0];
      replaceVideoTrack(screenTrack);

      toast.success("Screen sharing started");

      // Auto-stop when user clicks the browser's native "Stop sharing" button
      screenStream.getVideoTracks()[0].onended = () => {
        screenStreamRef.current = null;
        setIsSharing(false);

        // Replace track back with local camera video track
        const cameraTrack = localStream?.getVideoTracks()[0] || null;
        replaceVideoTrack(cameraTrack);

        toast.info("Screen sharing ended");
      };
    } catch (err: unknown) {
      const name = (err as Error)?.name;
      if (name !== "NotAllowedError") {
        toast.error("Screen sharing failed. Please try again.");
      }
      // User cancelled — silently ignore
    }
  };

  const stopSharing = toggleShare;

  const participants: VideoTileData[] = [
    ...(isSharing && screenStreamRef.current
      ? [
          {
            id: "screen",
            name: "Your Screen",
            isYou: false,
            muted: true,
            cameraOff: false,
            stream: screenStreamRef.current,
          },
        ]
      : []),
    {
      id: "you",
      name: userName,
      stream: localStream,
      isYou: true,
      muted,
      cameraOff,
      avatar: user?.avatar || undefined,
      isHost: isHost,
    },
    ...remotePeers.map((peer) => ({
      id: peer.peerId,
      name: peer.name,
      stream: peer.stream,
      isYou: false,
      muted: peer.muted,
      cameraOff: peer.cameraOff,
      avatar: peer.avatar,
      isHost: !!(peer.email && meeting?.host_email && peer.email === meeting.host_email),
    })),
  ];

  const onReaction = (emoji: string) => {
    const newR = { id: Date.now() + Math.random(), emoji, x: 20 + Math.random() * 60 };
    setReactions((r) => [...r, newR]);
    setTimeout(() => setReactions((r) => r.filter((x) => x.id !== newR.id)), 2000);
  };

  const onLeave = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    setIsSharing(false);
    if (isRecording) {
      stopRecording();
    }
    toast.success("You left the meeting");
    router.push("/dashboard");
  };

  const onToggleParticipants = () => {
    setParticipantsOpen((v) => !v);
    if (!participantsOpen) setChatOpen(false);
  };
  const onToggleChat = () => {
    setChatOpen((v) => !v);
    if (!chatOpen) setParticipantsOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#0B0B0F] to-[#12121A] flex items-center justify-center p-6 text-[#F0F0FF]">
        <div className="bg-[#111118]/80 backdrop-blur-md border border-[#1E1E2E] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          {/* Subtle top ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-[#2D6FFF] blur-md opacity-30 rounded-full" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2D6FFF] to-[#5E97FF]/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#2D6FFF]/10">
            <svg
              className="w-8 h-8 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <h1 className="font-display text-2xl font-bold text-white mb-3 tracking-tight font-sora">
            Joining Meeting...
          </h1>

          <p className="text-sm text-[#8888AA] leading-relaxed mb-6 px-2 font-inter">
            You will either join the meeting automatically or be placed in the waiting room until
            the host admits you.
          </p>

          <div className="pt-4 border-t border-[#1E1E2E] flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-xs text-[#666680] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6FFF] animate-pulse" />
              Connecting to secure media server
            </div>
          </div>
        </div>
      </div>
    );

  if (notFound) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-bold mb-2">Meeting Ended or Invalid</h1>
          <p className="text-[#8888AA] mb-6">This meeting doesn't exist or has already ended.</p>
          <Link href="/dashboard">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Intercept render if the session has ended
  if (meetingEnded) {
    return <MeetingEndedScreen title={meeting?.title} />;
  }

  // Intercept render if the guest is placed in the waiting room
  if (!admitted && !isHost) {
    return (
      <WaitingRoomScreen
        userName={userName}
        title={meeting?.title}
        muted={muted}
        cameraOff={cameraOff}
        onToggleMute={() => setMuted((v) => !v)}
        onToggleCamera={() => setCameraOff((v) => !v)}
        onLeave={onLeave}
        localStream={localStream}
      />
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col text-[#F0F0FF] overflow-hidden relative">
      <div className="flex items-center justify-between h-14 bg-[#111118] border-b border-[#1E1E2E] px-4 relative z-20">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#00C566] animate-pulse" />
          {wsConnected ? (
            <span className="text-[10px] text-[#00C566] font-mono">LIVE</span>
          ) : (
            <span className="text-[10px] text-[#FF3B55] font-mono">CONNECTING...</span>
          )}
          <span className="text-sm font-semibold text-white font-sora">
            {meeting?.title || "Instant Meeting"}
          </span>
          <span className="text-[#44445A]">|</span>
          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1A26] border border-[#2D2D3D] hover:border-[#2D6FFF]/50 hover:bg-[#222235] text-xs font-medium text-[#AAAAEE] hover:text-white transition-all duration-300 shadow-sm shrink-0"
              title="Meeting Details & Invite"
            >
              <Share2 size={12} className="text-[#2D6FFF]" />
              <span className="font-sora font-semibold">Details</span>
              <ChevronDown size={11} className={`text-[#8888AA] transition-transform duration-200 ${shareOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  ref={sharePanelRef}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 mt-2.5 w-80 bg-[#0F0F16]/95 backdrop-blur-xl border border-[#242436] rounded-2xl p-5 shadow-2xl z-50 text-left glow-blue"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E1E2E]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#2D6FFF]/10 border border-[#2D6FFF]/30 flex items-center justify-center">
                        <Share2 size={12} className="text-[#2D6FFF]" />
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sora">
                        Meeting Details
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-[#00C566]/10 text-[#00C566] text-[10px] px-2 py-0.5 rounded-full border border-[#00C566]/20 font-mono">
                      <Lock size={8} /> ENCRYPTED
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-[#8888AA] uppercase tracking-wider block mb-1 font-semibold">Title</span>
                      <span className="text-sm text-white font-medium block truncate max-w-[260px]">{meeting?.title || "ZoomX Session"}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8888AA] uppercase tracking-wider block mb-1 font-semibold">Meeting ID</span>
                      <div className="flex items-center justify-between bg-[#14141F] border border-[#242436] rounded-lg px-2.5 py-1.5">
                        <span className="text-xs font-mono text-white select-all">{meetingId}</span>
                        <button
                          onClick={copyMeetingId}
                          className="p-1 hover:bg-[#1E1E2E] rounded transition text-[#8888AA] hover:text-white"
                          title="Copy ID"
                        >
                          {copiedId ? <Check size={12} className="text-[#00C566]" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8888AA] uppercase tracking-wider block mb-1 font-semibold">Join Link</span>
                      <div className="flex items-center justify-between bg-[#14141F] border border-[#242436] rounded-lg px-2.5 py-1.5">
                        <span className="text-xs text-white truncate max-w-[210px] font-mono select-all font-medium">
                          {getJoinLink()}
                        </span>
                        <button
                          onClick={copyJoinLink}
                          className="p-1 hover:bg-[#1E1E2E] rounded transition text-[#8888AA] hover:text-white"
                          title="Copy Link"
                        >
                          {copiedLink ? <Check size={12} className="text-[#00C566]" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={copyInvitation}
                      className="w-full py-2 bg-[#2D6FFF] hover:bg-[#235BDF] text-white rounded-xl text-xs font-semibold shadow-lg shadow-[#2D6FFF]/15 hover:shadow-[#2D6FFF]/25 transition duration-300 flex items-center justify-center gap-1.5"
                    >
                      {copiedInvitation ? <Check size={13} /> : <Mail size={13} />}
                      <span>Copy Full Invitation</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="text-sm font-mono text-[#F0F0FF] bg-[#1A1A26] px-4 py-1.5 rounded-full border border-[#1E1E2E]">
            {formattedTimer}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#00C566]/10 text-[#00C566] text-xs px-3 py-1 rounded-full border border-[#00C566]/30">
            <ShieldCheck size={12} /> Secure
          </span>
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
              isRecording
                ? "bg-[#FF3B55]/10 border-[#FF3B55]/30 text-[#FF3B55]"
                : "bg-[#1A1A26] border-[#1E1E2E] text-white"
            }`}
          >
            <Circle
              size={10}
              className={
                isRecording ? "fill-[#FF3B55] text-[#FF3B55] animate-pulse" : "text-red-500"
              }
            />
            {isRecording ? "Stop Rec" : "Record"}
          </button>
        </div>
      </div>

      {isSharing && (
        <div className="w-full h-8 bg-[#00C566]/10 border-b border-[#00C566]/30 flex items-center justify-center relative z-20">
          <span className="text-xs font-medium text-[#00C566]">🖥️ You are sharing your screen</span>
          <button
            onClick={stopSharing}
            className="absolute right-4 text-xs text-[#00C566] underline"
          >
            Stop Sharing
          </button>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {/* Video grid fills all remaining height and width */}
        <div className="flex-1 min-h-0 flex w-full">
          <VideoGrid participants={participants} />
        </div>
        <ParticipantPanel
          open={participantsOpen}
          onClose={() => setParticipantsOpen(false)}
          participants={participants}
          isHost={isHost}
          pendingAdmissions={pendingAdmissions}
          onAdmit={admitPeer}
          onDeny={denyPeer}
          onAdmitAll={admitAll}
          onKick={kickPeer}
          onMuteParticipant={muteParticipant}
          onUnmuteParticipant={unmuteParticipant}
          onStopParticipantVideo={stopParticipantVideo}
        />
        <ChatPanel
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={chatMessages}
          onSend={sendChat}
        />

        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -240 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute bottom-4 text-5xl pointer-events-none"
              style={{ left: `${r.x}%` }}
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ControlBar
        muted={muted}
        cameraOff={cameraOff}
        isSharing={isSharing}
        onToggleMute={() => setMuted((v) => !v)}
        onToggleCamera={() => setCameraOff((v) => !v)}
        onToggleShare={toggleShare}
        onToggleParticipants={onToggleParticipants}
        onToggleChat={onToggleChat}
        onLeave={onLeave}
        meetingId={meetingId}
        elapsed={elapsed}
        participantsCount={participants.length}
        participantsOpen={participantsOpen}
        chatOpen={chatOpen}
        onReact={setReaction}
        isHost={isHost}
        onEndMeeting={handleEndMeeting}
      />

      <EmojiReaction emoji={reaction} onComplete={() => setReaction(null)} />
    </div>
  );
}
