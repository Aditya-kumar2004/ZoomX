"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Video, VideoOff, UserMinus } from "lucide-react";
import type { VideoTileData } from "./VideoTile";

interface ParticipantPanelProps {
  open: boolean;
  onClose: () => void;
  participants: VideoTileData[];
  isHost?: boolean;
  pendingAdmissions?: { peerId: string; name: string }[];
  onAdmit?: (peerId: string) => void;
  onDeny?: (peerId: string) => void;
  onAdmitAll?: () => void;
  onKick?: (peerId: string) => void;
  onMuteParticipant?: (peerId: string) => void;
  onUnmuteParticipant?: (peerId: string) => void;
  onStopParticipantVideo?: (peerId: string) => void;
}

export function ParticipantPanel({
  open,
  onClose,
  participants,
  isHost = false,
  pendingAdmissions = [],
  onAdmit,
  onDeny,
  onAdmitAll,
  onKick,
  onMuteParticipant,
  onUnmuteParticipant,
  onStopParticipantVideo,
}: ParticipantPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-screen w-[320px] bg-[#111118] border-l border-[#1E1E2E] z-40 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#1E1E2E]">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white font-sora">Participants</span>
              <span className="bg-[#2D2D3D] text-white text-xs px-2 py-0.5 rounded-full font-mono">
                {participants.length}
              </span>
            </div>
            <button onClick={onClose} className="text-[#8888AA] hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Waiting Room Section (Host Only) */}
          {isHost && pendingAdmissions.length > 0 && (
            <div className="border-b border-[#1E1E2E] bg-[#161622] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#FF9500] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-pulse" />
                  Waiting Room ({pendingAdmissions.length})
                </span>
                {pendingAdmissions.length > 1 && onAdmitAll && (
                  <button
                    onClick={onAdmitAll}
                    className="text-xs bg-gradient-to-r from-[#2D6FFF] to-[#5E97FF] hover:from-[#235BDF] hover:to-[#4D88FF] text-white px-2.5 py-1 rounded-lg font-semibold transition shadow-sm shadow-[#2D6FFF]/20"
                  >
                    Admit All
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                {pendingAdmissions.map((p) => (
                  <div
                    key={p.peerId}
                    className="flex items-center justify-between bg-[#1C1C28] border border-[#2D2D3D] rounded-xl p-2.5 hover:border-[#44445A] transition"
                  >
                    <span className="text-sm font-medium text-white truncate max-w-[120px]" title={p.name}>
                      {p.name}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onDeny?.(p.peerId)}
                        className="text-xs bg-[#FF3B55]/10 hover:bg-[#FF3B55]/20 text-[#FF3B55] px-2.5 py-1 rounded-lg font-semibold transition"
                      >
                        Deny
                      </button>
                      <button
                        onClick={() => onAdmit?.(p.peerId)}
                        className="text-xs bg-[#00C566]/10 hover:bg-[#00C566]/20 text-[#00C566] px-2.5 py-1 rounded-lg font-semibold transition"
                      >
                        Admit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2">
            {participants.map((p, index) => {
              const gradients = [
                "from-[#2D6FFF] to-[#7B5CFF]",
                "from-[#FF6B6B] to-[#FF3B55]",
                "from-[#00C566] to-[#00A550]",
                "from-[#FF9500] to-[#FF6B00]",
              ];
              
              const isScreen = p.id === "screen";
              const showControls = isHost && !p.isYou && !isScreen;

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1A1A26] transition cursor-default"
                >
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                    >
                      {p.name[0].toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-white truncate max-w-[110px]" title={p.name}>
                        {p.name}
                      </span>
                      {p.isYou && (
                        <span className="text-[9px] bg-white/10 text-[#8888AA] px-1.5 py-0.25 rounded-md shrink-0">
                          You
                        </span>
                      )}
                      {p.isHost && (
                        <span className="text-[9px] bg-[#2D6FFF]/20 text-[#2D6FFF] px-1.5 py-0.25 rounded-md shrink-0">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Action Buttons for Host, or static indicators for Guests */}
                  <div className="flex items-center gap-1 shrink-0">
                    {showControls ? (
                      <>
                        {/* Audio Mute/Unmute */}
                        {p.muted ? (
                          <button
                            onClick={() => onUnmuteParticipant?.(p.id)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-[#FF3B55] hover:text-white transition"
                            title="Unmute Participant"
                          >
                            <MicOff size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onMuteParticipant?.(p.id)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-[#00C566] hover:text-[#FF3B55] transition"
                            title="Mute Participant"
                          >
                            <Mic size={14} />
                          </button>
                        )}

                        {/* Video Stop (Cannot force on for privacy reasons) */}
                        {p.cameraOff ? (
                          <div className="p-1.5 text-[#44445A]" title="Camera is off">
                            <VideoOff size={14} />
                          </div>
                        ) : (
                          <button
                            onClick={() => onStopParticipantVideo?.(p.id)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-[#00C566] hover:text-[#FF3B55] transition"
                            title="Turn Off Camera"
                          >
                            <Video size={14} />
                          </button>
                        )}

                        {/* Kick / Remove */}
                        <button
                          onClick={() => onKick?.(p.id)}
                          className="p-1.5 rounded-lg hover:bg-[#FF3B55]/15 text-[#FF3B55] hover:bg-[#FF3B55]/25 transition"
                          title="Remove Participant"
                        >
                          <UserMinus size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        {p.muted ? (
                          <MicOff size={14} className="text-[#44445A] p-0.5" />
                        ) : (
                          <Mic size={14} className="text-[#00C566] p-0.5" />
                        )}
                        {p.cameraOff ? (
                          <VideoOff size={14} className="text-[#44445A] p-0.5" />
                        ) : (
                          <Video size={14} className="text-[#00C566] p-0.5" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
