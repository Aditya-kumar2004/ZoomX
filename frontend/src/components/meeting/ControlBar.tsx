"use client";
import { useState, useEffect } from "react";
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
  ChevronUp,
  Shield,
  BarChart3,
  LayoutGrid,
  Circle,
  Settings,
  UserPlus,
  VolumeX,
} from "lucide-react";
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

  // Chevron dropdown states
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showParticipantsMenu, setShowParticipantsMenu] = useState(false);

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
  const meetingId = props.meetingId;

  const handleCopyId = () => {
    navigator.clipboard.writeText(meetingId);
    toast.success("Meeting ID copied to clipboard!");
  };

  // Close all menus when clicking outside
  useEffect(() => {
    const handleOuterClick = () => {
      setShowAudioMenu(false);
      setShowVideoMenu(false);
      setShowShareMenu(false);
      setShowParticipantsMenu(false);
    };
    window.addEventListener("click", handleOuterClick);
    return () => window.removeEventListener("click", handleOuterClick);
  }, []);

  return (
    <>
      <div className="h-[76px] bg-[#121212] border-t border-[#1C1C1C] flex items-center justify-between px-6 z-35 relative select-none w-full">
        {/* LEFT SECTION: Spacer to balance layout and keep center buttons centered */}
        <div className="w-[120px] shrink-0 hidden sm:block" />

        {/* CENTER SECTION: Zoom Style Controls */}
        <div className="flex items-center justify-start lg:justify-center gap-0.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] max-w-full px-2 flex-grow">
          
          {/* Mute / Unmute Button */}
          <div className="relative flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none group">
            <div className="flex items-center justify-center gap-0.5 mt-0.5 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMic();
                }}
                className="p-1 rounded hover:bg-zinc-700/30 transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <MicOff size={19} className="text-[#FF3B30] shrink-0" />
                ) : (
                  <Mic size={19} className="shrink-0" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAudioMenu(!showAudioMenu);
                  setShowVideoMenu(false);
                  setShowShareMenu(false);
                  setShowParticipantsMenu(false);
                }}
                className="p-0.5 rounded hover:bg-zinc-700/30 transition-colors"
                title="Audio Options"
              >
                <ChevronUp size={11} className="text-zinc-500 hover:text-zinc-300 shrink-0" />
              </button>
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              {isMuted ? "Unmute" : "Mute"}
            </span>

            {/* Audio Dropdown Menu */}
            <AnimatePresence>
              {showAudioMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-56 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg shadow-2xl z-55 text-left p-1 text-xs text-zinc-200"
                >
                  <div className="px-2 py-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Select a Microphone</div>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shrink-0" />
                    Microphone (Realtek Audio)
                  </button>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate text-zinc-400">
                    <div className="w-1.5 h-1.5 shrink-0" />
                    Default - Microphone
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <div className="px-2 py-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Select a Speaker</div>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shrink-0" />
                    Speakers (Realtek Audio)
                  </button>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate text-zinc-400">
                    <div className="w-1.5 h-1.5 shrink-0" />
                    Default - Speakers
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 text-zinc-300">
                    <Settings size={12} className="shrink-0" />
                    Audio Settings...
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stop / Start Video Button */}
          <div className="relative flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none group">
            <div className="flex items-center justify-center gap-0.5 mt-0.5 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCamera();
                }}
                className="p-1 rounded hover:bg-zinc-700/30 transition-colors"
                title={isCameraOff ? "Start Video" : "Stop Video"}
              >
                {isCameraOff ? (
                  <VideoOff size={19} className="text-[#FF3B30] shrink-0" />
                ) : (
                  <Video size={19} className="shrink-0" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVideoMenu(!showVideoMenu);
                  setShowAudioMenu(false);
                  setShowShareMenu(false);
                  setShowParticipantsMenu(false);
                }}
                className="p-0.5 rounded hover:bg-zinc-700/30 transition-colors"
                title="Video Options"
              >
                <ChevronUp size={11} className="text-zinc-500 hover:text-zinc-300 shrink-0" />
              </button>
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              {isCameraOff ? "Start Video" : "Stop Video"}
            </span>

            {/* Video Dropdown Menu */}
            <AnimatePresence>
              {showVideoMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-56 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg shadow-2xl z-55 text-left p-1 text-xs text-zinc-200"
                >
                  <div className="px-2 py-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Select a Camera</div>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shrink-0" />
                    Integrated Camera
                  </button>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate text-zinc-400">
                    <div className="w-1.5 h-1.5 shrink-0" />
                    OBS Virtual Camera
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 text-zinc-300">
                    <Settings size={12} className="shrink-0" />
                    Video Settings...
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Button */}
          <button
            onClick={() => {
              toast.info("Security settings are managed by the meeting host.");
            }}
            className="flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none"
          >
            <div className="flex items-center justify-center mt-1">
              <Shield size={19} className="shrink-0" />
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Security
            </span>
          </button>

          {/* Participants Button */}
          <div className="relative flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none group">
            <div className="flex items-center justify-center gap-0.5 mt-0.5 w-full relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleParticipants();
                }}
                className={`p-1 rounded hover:bg-zinc-700/30 transition-colors relative ${
                  props.participantsOpen ? "text-[#2D6FFF]" : ""
                }`}
                title="Toggle Participants"
              >
                <Users size={19} className="shrink-0" />
                {participantCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#2D6FFF] text-[8px] text-white font-bold flex items-center justify-center shadow-md shrink-0 select-none">
                    {participantCount}
                  </span>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowParticipantsMenu(!showParticipantsMenu);
                  setShowAudioMenu(false);
                  setShowVideoMenu(false);
                  setShowShareMenu(false);
                }}
                className="p-0.5 rounded hover:bg-zinc-700/30 transition-colors"
                title="Participant Options"
              >
                <ChevronUp size={11} className="text-zinc-500 hover:text-zinc-300 shrink-0" />
              </button>
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Participants
            </span>

            {/* Participants Dropdown Menu */}
            <AnimatePresence>
              {showParticipantsMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg shadow-2xl z-55 text-left p-1 text-xs text-zinc-200"
                >
                  <button
                    onClick={() => {
                      handleCopyId();
                      setShowParticipantsMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 text-zinc-300"
                  >
                    <UserPlus size={12} className="shrink-0" />
                    Invite Participants
                  </button>
                  {props.isHost && props.onEndMeeting && (
                    <>
                      <div className="h-px bg-zinc-800 my-1" />
                      <button
                        onClick={() => {
                          toast.success("Requested all participants to mute.");
                          setShowParticipantsMenu(false);
                        }}
                        className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 text-red-400 hover:text-red-300"
                      >
                        <VolumeX size={12} className="shrink-0" />
                        Mute All
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Button */}
          <button
            onClick={toggleChat}
            className={`flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none ${
              props.chatOpen ? "text-[#2D6FFF]" : ""
            }`}
          >
            <div className="flex items-center justify-center mt-1">
              <MessageSquare size={19} className="shrink-0" />
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Chat
            </span>
          </button>

          {/* Share Screen Button - Green style from Reference */}
          <div className="relative flex flex-col items-center justify-between py-1 h-13 w-[84px] rounded-lg hover:bg-zinc-800/40 text-[#30D158] hover:text-[#40E168] transition-colors duration-150 select-none group">
            <div className="flex items-center justify-center gap-0.5 mt-0.5 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleShare();
                }}
                className="p-1 rounded hover:bg-zinc-700/30 transition-colors"
                title={isSharing ? "Stop Share" : "Share Screen"}
              >
                <MonitorUp size={19} className="shrink-0 text-[#30D158]" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareMenu(!showShareMenu);
                  setShowAudioMenu(false);
                  setShowVideoMenu(false);
                  setShowParticipantsMenu(false);
                }}
                className="p-0.5 rounded hover:bg-zinc-700/30 transition-colors"
                title="Sharing Options"
              >
                <ChevronUp size={11} className="text-[#30D158] hover:text-[#40E168] shrink-0" />
              </button>
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate text-[#30D158]">
              Share Screen
            </span>

            {/* Share Dropdown Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-64 bg-[#1A1A1A] border border-[#2B2B2B] rounded-lg shadow-2xl z-55 text-left p-1 text-xs text-zinc-200"
                >
                  <div className="px-2 py-1 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Sharing Permissions</div>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] shrink-0" />
                    One participant can share
                  </button>
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 truncate text-zinc-400">
                    <div className="w-1.5 h-1.5 shrink-0" />
                    Multiple participants can share
                  </button>
                  <div className="h-px bg-zinc-800 my-1" />
                  <button className="w-full text-left px-2 py-1.5 hover:bg-zinc-800 rounded flex items-center gap-1.5 text-zinc-300">
                    <Settings size={12} className="shrink-0" />
                    Advanced Sharing Options...
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Polling Button */}
          <button
            onClick={() => {
              toast.info("Polling features are coming soon!");
            }}
            className="flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none"
          >
            <div className="flex items-center justify-center mt-1">
              <BarChart3 size={19} className="shrink-0" />
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Polling
            </span>
          </button>

          {/* Record Button */}
          <button
            onClick={() => {
              toast.info("Record meeting session from the top header panel.");
            }}
            className="flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none"
          >
            <div className="flex items-center justify-center mt-1">
              <Circle size={19} className="text-red-500 fill-red-500 shrink-0" />
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Record
            </span>
          </button>

          {/* Breakout Rooms Button */}
          <button
            onClick={() => {
              toast.info("Breakout Rooms are coming soon!");
            }}
            className="flex flex-col items-center justify-between py-1 h-13 w-[88px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none"
          >
            <div className="flex items-center justify-center mt-1">
              <LayoutGrid size={19} className="shrink-0" />
            </div>
            <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
              Breakout Rooms
            </span>
          </button>

          {/* Reactions Button */}
          <div className="relative flex flex-col items-center justify-center select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmojis(!showEmojis);
                setShowAudioMenu(false);
                setShowVideoMenu(false);
                setShowShareMenu(false);
                setShowParticipantsMenu(false);
              }}
              className={`flex flex-col items-center justify-between py-1 h-13 w-[80px] rounded-lg hover:bg-zinc-800/40 text-zinc-300 hover:text-white transition-colors duration-150 select-none ${
                showEmojis ? "bg-zinc-800/40 text-white" : ""
              }`}
            >
              <div className="flex items-center justify-center mt-1">
                <Smile size={19} className="shrink-0" />
              </div>
              <span className="text-[10px] font-medium leading-none mb-1 text-center w-full select-none truncate">
                Reactions
              </span>
            </button>

            {/* Reactions Popover */}
            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 350, damping: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[56px] left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#2B2B2B] rounded-xl px-3.5 py-2 flex gap-3 text-xl z-55 shadow-2xl animate-none"
                >
                  {["👍", "❤️", "😂", "😮", "👏", "🎉"].map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.25, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        onReact(emoji);
                        setShowEmojis(false);
                      }}
                      className="transition-transform duration-100 filter drop-shadow-md cursor-pointer hover:rotate-6 shrink-0"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT SECTION: Zoom Style End/Leave Button */}
        <div className="w-[120px] shrink-0 flex justify-end">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="bg-[#E02828] hover:bg-[#F23B3B] active:bg-[#B01818] text-white px-4.5 py-1.5 rounded-lg text-[13px] font-semibold transition-colors duration-150 shrink-0 font-sora shadow-sm"
          >
            {props.isHost ? "End" : "Leave"}
          </button>
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
