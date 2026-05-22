"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Smile,
  Users,
  MessageSquare,
  LogOut,
  Lock,
  Copy,
} from "lucide-react";
import { formatDuration } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  muted: boolean;
  cameraOff: boolean;
  isSharing: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleShare: () => void;
  onToggleParticipants: () => void;
  onToggleChat: () => void;
  onLeave: () => void;
  meetingId: string;
  elapsed: number;
  participantsCount: number;
  participantsOpen: boolean;
  chatOpen: boolean;
  onReact: (emoji: string) => void;
  isHost?: boolean;
  onEndMeeting?: () => void;
}

export function ControlBar(props: Props) {
  const { user } = useAuth();
  const [showEmojis, setShowEmojis] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const toggleMic = props.onToggleMute;
  const toggleCamera = props.onToggleCamera;
  const toggleShare = props.onToggleShare;
  const toggleParticipants = props.onToggleParticipants;
  const toggleChat = props.onToggleChat;

  const isMuted = props.muted;
  const isCameraOff = props.cameraOff;
  const isSharing = props.isSharing;
  const participantCount = props.participantsCount;
  const onReact = props.onReact;

  const formattedTimer = formatDuration(props.elapsed);
  const meetingId = props.meetingId;
  const userName = user?.name || (props.isHost ? "Host" : "Guest");
  const userAvatar = user?.avatar;

  const handleCopyId = () => {
    navigator.clipboard.writeText(meetingId);
    toast.success("Meeting ID copied to clipboard!");
  };

  return (
    <>
      <div className="h-20 bg-[#0A0A10]/95 backdrop-blur-xl border-t border-[#1E1E2E]/80 flex items-center justify-between px-6 z-35 relative select-none">
        {/* Subtle top horizontal ambient line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#2D6FFF]/35 to-transparent" />

        {/* LEFT SECTION: Sleek Local User Profile Card */}
        <div className="flex items-center gap-3 bg-[#13131F]/80 backdrop-blur-md border border-[#242436] px-4 py-2 rounded-2xl shadow-inner min-w-[240px] max-w-[280px]">
          {/* Avatar with Status indicator */}
          <div className="relative shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2D6FFF] to-[#7B5CFF] border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                {userName[0]}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00C566] border-2 border-[#0A0A10] animate-pulse shadow-sm shadow-[#00C566]/50" />
          </div>

          {/* Name & Security Details */}
          <div className="flex flex-col text-left overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white font-sora truncate max-w-[100px]">
                {userName}
              </span>
              <span className="text-[9px] text-[#00C566] bg-[#00C566]/10 border border-[#00C566]/20 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono font-bold shrink-0">
                <Lock size={8} /> SECURE
              </span>
            </div>
            {/* Copier pill */}
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1 text-[10px] text-[#8888AA] hover:text-[#2D6FFF] mt-0.5 transition font-mono group truncate text-left"
              title="Click to copy meeting ID"
            >
              <span className="truncate">ID: {meetingId?.slice(0, 8)}...</span>
              <Copy size={9} className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#2D6FFF] shrink-0" />
            </button>
          </div>

          {/* Elegant vertical separator */}
          <span className="w-px h-6 bg-[#242436] shrink-0 mx-1" />

          {/* Timer Display */}
          <div className="bg-[#181829] border border-[#24243B] text-white font-mono rounded-xl px-2.5 py-1 text-xs font-semibold tracking-tight shadow-sm min-w-[70px] text-center shrink-0">
            {formattedTimer}
          </div>
        </div>

        {/* CENTER SECTION: Interactive Premium Dark Glass controls */}
        <div className="flex items-center gap-4">
          {/* Microphone button */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={toggleMic}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                isMuted
                  ? "bg-[#FF3B55]/10 border-[#FF3B55] text-[#FF3B55] shadow-[0_0_15px_rgba(255,59,85,0.25)] hover:bg-[#FF3B55]/20"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232] shadow-sm"
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </div>

          {/* Camera button */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={toggleCamera}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                isCameraOff
                  ? "bg-[#FF3B55]/10 border-[#FF3B55] text-[#FF3B55] shadow-[0_0_15px_rgba(255,59,85,0.25)] hover:bg-[#FF3B55]/20"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232] shadow-sm"
              }`}
            >
              {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              {isCameraOff ? "Start Video" : "Stop Video"}
            </span>
          </div>

          {/* Screen Share button */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={toggleShare}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                isSharing
                  ? "bg-[#00C566]/10 border-[#00C566] text-[#00C566] shadow-[0_0_15px_rgba(0,197,102,0.25)] hover:bg-[#00C566]/20"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232] shadow-sm"
              }`}
            >
              <MonitorUp size={20} />
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              {isSharing ? "Stop Share" : "Share"}
            </span>
          </div>

          {/* Emoji Reactions Trigger & Popover */}
          <div className="relative flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={() => setShowEmojis(!showEmojis)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                showEmojis
                  ? "bg-[#2D6FFF]/10 border-[#2D6FFF] text-[#2D6FFF] shadow-[0_0_15px_rgba(45,111,255,0.25)] animate-none"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232]"
              }`}
            >
              <Smile size={20} />
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              React
            </span>

            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#0F0F16]/95 backdrop-blur-xl border border-[#242436] rounded-2xl px-4 py-2.5 flex gap-3.5 text-2xl z-55 shadow-2xl glow-blue"
                >
                  {/* Subtle top vertical premium border line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#2D6FFF] to-[#7B5CFF] rounded-t-2xl" />
                  {["👍", "❤️", "😂", "😮", "👏", "🎉"].map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.3, y: -4 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onReact(emoji);
                        setShowEmojis(false);
                      }}
                      className="transition-transform duration-100 filter drop-shadow-md cursor-pointer hover:rotate-6"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* People/Participants list */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={toggleParticipants}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                props.participantsOpen
                  ? "bg-[#2D6FFF]/10 border-[#2D6FFF] text-[#2D6FFF] shadow-[0_0_15px_rgba(45,111,255,0.25)]"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232]"
              }`}
            >
              <Users size={20} />
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-[#2D6FFF] border border-[#0A0A10] text-[9px] text-white font-bold tracking-tight shadow-md flex items-center justify-center min-w-[18px]">
                {participantCount}
              </span>
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              People
            </span>
          </div>

          {/* Chat Panel Trigger */}
          <div className="flex flex-col items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              onClick={toggleChat}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 relative ${
                props.chatOpen
                  ? "bg-[#2D6FFF]/10 border-[#2D6FFF] text-[#2D6FFF] shadow-[0_0_15px_rgba(45,111,255,0.25)]"
                  : "bg-[#13131F]/80 border-[#242436] text-white hover:border-[#3D3D58] hover:bg-[#222232]"
              }`}
            >
              <MessageSquare size={20} />
            </motion.button>
            <span className="text-[10px] font-semibold text-[#8888AA] transition font-sora">
              Chat
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: Glowing Gradient Leave Button */}
        <div className="min-w-[240px] flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF3B55] to-[#FF5E73] hover:from-[#E0303F] hover:to-[#FF3B55] px-6 py-2.5 rounded-2xl text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#FF3B55]/20 hover:shadow-[#FF3B55]/35 hover:shadow-[0_0_15px_rgba(255,59,85,0.3)] border border-[#FF3B55]/30 shrink-0 font-sora"
          >
            <LogOut size={16} />
            Leave
          </motion.button>
        </div>
      </div>

      {/* LEAVE MODAL: Translucent Glassmorphic overlay */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#0F0F16]/95 backdrop-blur-xl border border-[#242436] rounded-3xl p-8 w-[380px] text-center shadow-2xl relative overflow-hidden"
            >
              {/* Top red-glowing premium border line */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF3B55] to-[#FF5E73]" />

              <div className="w-16 h-16 rounded-2xl bg-[#FF3B55]/10 border border-[#FF3B55]/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <LogOut size={28} className="text-[#FF3B55]" />
              </div>
              
              <h3 className="text-xl font-bold text-white font-sora tracking-tight">
                {props.isHost ? "End or Leave Session?" : "Leave Meeting?"}
              </h3>
              
              <p className="text-sm text-[#8888AA] mt-2 mb-8 leading-relaxed font-inter">
                {props.isHost
                  ? "As the host, you can choose to end this session for everyone, or leave the room and let the meeting continue."
                  : "Are you sure you want to exit this meeting? You can re-join later using the same link."}
              </p>
              
              {props.isHost ? (
                <div className="flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (props.onEndMeeting) {
                        props.onEndMeeting();
                      } else {
                        props.onLeave();
                      }
                    }}
                    className="w-full bg-gradient-to-r from-[#FF3B55] to-[#FF5E73] hover:from-[#E0303F] hover:to-[#FF3B55] text-white py-3 rounded-2xl text-sm font-semibold transition shadow-lg shadow-[#FF3B55]/10 font-sora"
                  >
                    End Meeting for All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      props.onLeave();
                    }}
                    className="w-full bg-[#1C1C2B] border border-[#2B2B3E] hover:bg-[#252538] hover:border-[#3D3D58] text-white py-3 rounded-2xl text-sm font-semibold transition font-sora"
                  >
                    Just Leave Meeting
                  </motion.button>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="w-full bg-transparent hover:bg-white/5 text-[#8888AA] hover:text-white py-2.5 rounded-2xl text-sm font-medium transition font-inter"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 bg-[#1C1C2B] border border-[#2B2B3E] hover:bg-[#252538] hover:border-[#3D3D58] text-white py-3 rounded-2xl text-sm font-semibold transition font-sora"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      props.onLeave();
                    }}
                    className="flex-1 bg-gradient-to-r from-[#FF3B55] to-[#FF5E73] hover:from-[#E0303F] hover:to-[#FF3B55] text-white py-3 rounded-2xl text-sm font-semibold transition font-sora shadow-lg shadow-[#FF3B55]/10"
                  >
                    Leave
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

