"use client";

import { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/ZButton";
import { toast } from "sonner";
import { Camera, Mic, Settings2, VideoOff } from "lucide-react";

export default function SettingsPage() {
  // Preferences State
  const [cameraOnDefault, setCameraOnDefault] = useState(true);
  const [micOnDefault, setMicOnDefault] = useState(true);
  const [preferredCamera, setPreferredCamera] = useState("");
  const [preferredMic, setPreferredMic] = useState("");

  // Devices lists
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  
  // Preview stream
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const camDefault = localStorage.getItem("zoomx_camera_enabled_by_default");
    const micDefault = localStorage.getItem("zoomx_mic_enabled_by_default");
    const camId = localStorage.getItem("zoomx_preferred_camera_id");
    const micId = localStorage.getItem("zoomx_preferred_mic_id");

    if (camDefault !== null) setCameraOnDefault(camDefault === "true");
    if (micDefault !== null) setMicOnDefault(micDefault === "true");
    if (camId) setPreferredCamera(camId);
    if (micId) setPreferredMic(micId);
  }, []);

  // Request permissions and enumerate devices
  useEffect(() => {
    async function loadDevices() {
      try {
        // Request temporary access to trigger permissions dialog and get labels
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === "videoinput");
        const audioDevices = allDevices.filter(d => d.kind === "audioinput");

        setCameras(videoDevices);
        setMicrophones(audioDevices);

        // Set default preferred devices if not already chosen
        if (videoDevices.length > 0 && !localStorage.getItem("zoomx_preferred_camera_id")) {
          setPreferredCamera(videoDevices[0].deviceId);
        }
        if (audioDevices.length > 0 && !localStorage.getItem("zoomx_preferred_mic_id")) {
          setPreferredMic(audioDevices[0].deviceId);
        }

        // Release the temporary stream tracks
        tempStream.getTracks().forEach(t => t.stop());
        setPermissionError(false);
      } catch (err) {
        console.error("Error loading audio/video devices:", err);
        setPermissionError(true);
      }
    }
    
    loadDevices();
  }, []);

  // Update preview stream when preferredCamera changes
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function startPreview() {
      if (typeof window === "undefined" || permissionError) return;
      
      // Stop old tracks
      if (previewStream) {
        previewStream.getTracks().forEach(t => t.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: preferredCamera ? { deviceId: { exact: preferredCamera } } : true,
          audio: false // Don't record audio in preview to prevent feedback
        });
        activeStream = stream;
        setPreviewStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Failed to get preview stream:", err);
        setPreviewStream(null);
      }
    }

    startPreview();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [preferredCamera, permissionError]);

  // Bind existing stream to video element when it is updated
  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  const saveSettings = () => {
    localStorage.setItem("zoomx_camera_enabled_by_default", String(cameraOnDefault));
    localStorage.setItem("zoomx_mic_enabled_by_default", String(micOnDefault));
    localStorage.setItem("zoomx_preferred_camera_id", preferredCamera);
    localStorage.setItem("zoomx_preferred_mic_id", preferredMic);
    toast.success("Settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Settings2 className="w-8 h-8 text-[#2D6FFF]" /> Settings
          </h1>
          <p className="text-[#8888AA] mt-1">Configure your audio, video, and meeting preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Card */}
          <div className="lg:col-span-2 card-base bg-[#0A0A0F]/70 border border-[#1E1E2E] backdrop-blur-xl p-6 md:p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-semibold border-b border-[#1E1E2E] pb-3 text-white">Audio & Video Sources</h2>
            
            {permissionError && (
              <div className="border border-[#FF3B55]/30 bg-[#FF3B55]/10 text-[#FF8093] rounded-2xl p-4 text-sm">
                Please grant camera and microphone permissions in your browser to select devices.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#8888AA] font-medium block mb-2">Camera Input</label>
                <div className="relative">
                  <select
                    value={preferredCamera}
                    onChange={(e) => setPreferredCamera(e.target.value)}
                    className="w-full bg-[#111118] border border-[#1E1E2E] text-white rounded-xl py-3 px-4 outline-none focus:border-[#2D6FFF] transition appearance-none"
                  >
                    {cameras.length === 0 ? (
                      <option value="">No cameras found</option>
                    ) : (
                      cameras.map((c) => (
                        <option key={c.deviceId} value={c.deviceId}>
                          {c.label || `Camera ${c.deviceId.slice(0, 5)}`}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8888AA]">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#8888AA] font-medium block mb-2">Microphone Input</label>
                <div className="relative">
                  <select
                    value={preferredMic}
                    onChange={(e) => setPreferredMic(e.target.value)}
                    className="w-full bg-[#111118] border border-[#1E1E2E] text-white rounded-xl py-3 px-4 outline-none focus:border-[#2D6FFF] transition appearance-none"
                  >
                    {microphones.length === 0 ? (
                      <option value="">No microphones found</option>
                    ) : (
                      microphones.map((m) => (
                        <option key={m.deviceId} value={m.deviceId}>
                          {m.label || `Microphone ${m.deviceId.slice(0, 5)}`}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8888AA]">
                    <Mic className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b border-[#1E1E2E] pt-4 pb-3 text-white">Meeting Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                <div>
                  <div className="font-medium text-white">Start with Camera On</div>
                  <div className="text-xs text-[#8888AA] mt-0.5">Automatically open your video stream when joining.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cameraOnDefault}
                    onChange={(e) => setCameraOnDefault(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2D2D3D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6FFF]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111118] border border-[#1E1E2E]">
                <div>
                  <div className="font-medium text-white">Start with Microphone On</div>
                  <div className="text-xs text-[#8888AA] mt-0.5">Automatically unmute your microphone when joining.</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={micOnDefault}
                    onChange={(e) => setMicOnDefault(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#2D2D3D] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6FFF]"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="lg" onClick={saveSettings}>
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Camera Preview Card */}
          <div className="card-base bg-[#0A0A0F]/70 border border-[#1E1E2E] backdrop-blur-xl p-6 rounded-3xl flex flex-col items-center">
            <h2 className="text-lg font-semibold text-white mb-4 self-start">Camera Preview</h2>
            <div className="w-full aspect-video rounded-2xl bg-[#111118] border border-[#1E1E2E] relative flex items-center justify-center overflow-hidden">
              {previewStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="text-center p-4">
                  <VideoOff className="w-10 h-10 text-[#FF3B55]/55 mx-auto mb-2" />
                  <div className="text-sm font-medium text-white">No active camera preview</div>
                  <p className="text-xs text-[#8888AA] mt-1 max-w-[180px] mx-auto">
                    Select a camera or grant browser permissions to test feed.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-4 w-full text-center text-xs text-[#8888AA]">
              Video feed is local-only and not stored anywhere.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
