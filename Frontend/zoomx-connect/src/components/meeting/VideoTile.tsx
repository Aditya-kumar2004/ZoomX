"use client";
import { useEffect, useRef } from "react";
import { Mic, MicOff, VideoOff } from "lucide-react";

export interface VideoTileData {
  id: string;
  name: string;
  muted?: boolean;
  cameraOff?: boolean;
  isYou?: boolean;
  stream?: MediaStream | null;
  avatar?: string;
}

export interface VideoTileProps {
  stream?: MediaStream | null;
  name?: string;
  isYou?: boolean;
  muted?: boolean;
  cameraOff?: boolean;
  avatar?: string;

  // Compatibility with VideoGrid which passes p
  p?: VideoTileData;
  extraClass?: string;
}

export function VideoTile(props: VideoTileProps) {
  const name = props.name ?? props.p?.name ?? "";
  const stream = props.stream !== undefined ? props.stream : props.p?.stream;
  const isYou = props.isYou ?? props.p?.isYou ?? false;
  const muted = props.muted ?? props.p?.muted ?? false;
  const cameraOff = props.cameraOff ?? props.p?.cameraOff ?? false;
  const avatar = props.avatar ?? props.p?.avatar;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (!cameraOff && stream) {
        videoRef.current.srcObject = stream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, cameraOff]);

  const showVideo = !cameraOff && !!stream;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all duration-200 w-full h-full flex items-center justify-center ${
        isYou ? "border-2 border-[#2D6FFF]" : "border border-[#1E1E2E] hover:border-[#2D6FFF]"
      } ${props.extraClass || ""}`}
    >
      {/* Video Content OR Avatar content */}
      {showVideo ? (
        <div className="absolute inset-0 w-full h-full bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isYou}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] flex flex-col items-center justify-center gap-2">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-full object-cover border border-[#1E1E2E]/50 shadow-lg shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2D6FFF] flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white font-sora">
                {name ? name[0].toUpperCase() : ""}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-[#8888AA]">
            <VideoOff size={12} />
            <span>Camera off</span>
          </div>
        </div>
      )}

      {/* Bottom name bar (always shown) */}
      <div
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
        className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between z-10"
      >
        <span className="text-sm font-medium text-white">
          {name}
          {isYou ? " (You)" : ""}
        </span>
        {muted ? (
          <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <MicOff size={10} className="text-white" />
          </span>
        ) : (
          <Mic size={14} className="text-[#00C566]" />
        )}
      </div>
    </div>
  );
}
