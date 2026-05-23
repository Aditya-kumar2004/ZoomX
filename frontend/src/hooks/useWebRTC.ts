"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { meetingAPI } from "@/services/api";

const getWebSocketBase = (): string => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  const backend = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (backend) {
    let clean = backend.replace(/\/api\/?$/, "");
    if (clean.startsWith("https://")) {
      return clean.replace("https://", "wss://");
    }
    if (clean.startsWith("http://")) {
      return clean.replace("http://", "ws://");
    }
    return clean;
  }
  return "ws://localhost:8000";
};

const WS_BASE = getWebSocketBase();

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export interface RemotePeer {
  peerId: string;
  name: string;
  stream: MediaStream | null;
  muted: boolean;
  cameraOff: boolean;
  email?: string;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  senderEmail?: string;
  senderAvatar?: string;
}

interface UseWebRTCOptions {
  meetingId: string;
  userName: string;
  localStream: MediaStream | null;
  muted?: boolean;
  cameraOff?: boolean;
  onRemoteReaction?: (emoji: string) => void;
  isHost?: boolean;
  onMutedByHost?: () => void;
  onUnmutedByHost?: () => void;
  onCameraOffByHost?: () => void;
  onKicked?: () => void;
  onMeetingEnded?: () => void;
}

export function useWebRTC({
  meetingId,
  userName,
  localStream,
  muted,
  cameraOff,
  onRemoteReaction,
  isHost = false,
  onMutedByHost,
  onUnmutedByHost,
  onCameraOffByHost,
  onKicked,
  onMeetingEnded,
}: UseWebRTCOptions) {
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const myPeerIdRef = useRef<string>("");
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  
  // Generate a unique session ID for this tab connection to distinguish multiple "Guest" users
  const myUniqueIdRef = useRef<string>("");
  if (!myUniqueIdRef.current) {
    myUniqueIdRef.current = Math.random().toString(36).substring(7);
  }

  const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [wsConnected, setWsConnected] = useState(false);

  // Admission States
  const [admitted, setAdmitted] = useState(true);
  const [pendingAdmissions, setPendingAdmissions] = useState<{ peerId: string; name: string }[]>([]);
  const [meetingEnded, setMeetingEnded] = useState(false);

  // Latest values Ref pattern to keep callback dependencies stable and prevent WebSocket reconnection loops
  const userNameRef = useRef(userName);
  const mutedRef = useRef(muted);
  const cameraOffRef = useRef(cameraOff);
  const onRemoteReactionRef = useRef(onRemoteReaction);
  const admittedRef = useRef(admitted);
  const isHostRef = useRef(isHost);
  const onMutedByHostRef = useRef(onMutedByHost);
  const onUnmutedByHostRef = useRef(onUnmutedByHost);
  const onCameraOffByHostRef = useRef(onCameraOffByHost);
  const onKickedRef = useRef(onKicked);
  const onMeetingEndedRef = useRef(onMeetingEnded);
  const userRef = useRef(user);

  useEffect(() => {
    userNameRef.current = userName;
    mutedRef.current = muted;
    cameraOffRef.current = cameraOff;
    onRemoteReactionRef.current = onRemoteReaction;
    admittedRef.current = admitted;
    isHostRef.current = !!isHost;
    onMutedByHostRef.current = onMutedByHost;
    onUnmutedByHostRef.current = onUnmutedByHost;
    onCameraOffByHostRef.current = onCameraOffByHost;
    onKickedRef.current = onKicked;
    onMeetingEndedRef.current = onMeetingEnded;
    userRef.current = user;
  });

  // Load chat history from SQLite DB when the meeting starts or participant joins
  useEffect(() => {
    if (!meetingId) return;

    let isMounted = true;
    meetingAPI.getMessages(meetingId)
      .then((data) => {
        if (!isMounted) return;

        const messagesArray = Array.isArray(data) ? data : (data?.results || []);
        const loadedMessages: ChatMessage[] = messagesArray.map((msg: any) => {
          const isMe = msg.sender_email === user?.email || (msg.sender_name === userName && !msg.sender_email);

          let timeFormatted = "";
          try {
            const date = new Date(msg.created_at);
            timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          } catch (e) {
            timeFormatted = "";
          }

          return {
            id: msg.id.toString(),
            sender: msg.sender_name,
            text: msg.message,
            time: timeFormatted,
            isMe,
            senderEmail: msg.sender_email || undefined,
            senderAvatar: msg.sender_avatar || undefined
          };
        });

        setChatMessages(loadedMessages);
      })
      .catch((err) => {
        console.error("Failed to load chat history:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [meetingId, user?.email, userName]);

  // ── Create a new RTCPeerConnection for a given peer ────────────────────────
  const createPeerConnection = useCallback(
    (peerId: string): RTCPeerConnection => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Add local tracks to the peer connection
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      // If we are currently screen sharing, replace video track immediately
      if (screenTrackRef.current) {
        setTimeout(() => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            sender.replaceTrack(screenTrackRef.current);
          }
        }, 100);
      }

      // When we receive a remote track, update state
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemotePeers((prev) =>
          prev.map((p) =>
            p.peerId === peerId ? { ...p, stream: remoteStream } : p
          )
        );
      };

      // Forward ICE candidates through WebSocket signaling server
      pc.onicecandidate = (event) => {
        if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "ice_candidate",
              target: peerId,
              candidate: event.candidate,
            })
          );
        }
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          removePeer(peerId);
        }
      };

      peersRef.current.set(peerId, pc);
      return pc;
    },
    [localStream]
  );

  // ── Remove a peer cleanly ──────────────────────────────────────────────────
  const removePeer = useCallback((peerId: string) => {
    const pc = peersRef.current.get(peerId);
    if (pc) {
      pc.close();
      peersRef.current.delete(peerId);
    }
    setRemotePeers((prev) => prev.filter((p) => p.peerId !== peerId));
  }, []);

  // ── Handle incoming WebSocket messages ────────────────────────────────────
  const handleMessage = useCallback(
    async (data: Record<string, unknown>) => {
      // Guests ignore WebRTC handshakes if they aren't admitted yet
      if (!admittedRef.current && !isHostRef.current) {
        const type = data.type as string;
        if (type === "chat") {
          const message = data.message as string;
          
          if (message.startsWith("__CONTROL__:admit_peer:peerId=")) {
            const targetPeerId = message.replace("__CONTROL__:admit_peer:peerId=", "");
            if (targetPeerId === myPeerIdRef.current) {
              setAdmitted(true);
              console.log("[WebRTC] I have been admitted by the host!");
              if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(
                  JSON.stringify({
                    type: "join",
                    name: `${userNameRef.current}||${userRef.current?.email || ""}||${userRef.current?.avatar || ""}__${myUniqueIdRef.current}`,
                  })
                );
              }
            }
          } else if (message.startsWith("__CONTROL__:deny_peer:peerId=")) {
            const targetPeerId = message.replace("__CONTROL__:deny_peer:peerId=", "");
            if (targetPeerId === myPeerIdRef.current) {
              if (onKickedRef.current) onKickedRef.current();
            }
          }
        }
        return;
      }

      const type = data.type as string;

      if (type === "peer_joined") {
        const peerId = data.peer_id as string;
        const rawName = data.name as string;
        const isSelf = rawName.endsWith(`__${myUniqueIdRef.current}`);
        
        const parts = rawName.split("__");
        const metadataPart = parts[0];
        const metaParts = metadataPart.split("||");
        const cleanName = metaParts[0];
        const peerEmail = metaParts[1] || "";
        const peerAvatar = metaParts[2] || "";

        // Register our own peer ID when our join broadcast echoes back
        if (isSelf) {
          myPeerIdRef.current = peerId;
          console.log("[WebRTC] Registered my peer ID:", peerId);

          // Broadcast our initial status once we have our peer ID
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: "chat",
                message: `__CONTROL__:status:muted=${!!mutedRef.current},cameraOff=${!!cameraOffRef.current}`,
                name: `${userNameRef.current}__${myUniqueIdRef.current}`,
              })
            );
          }
          return;
        }

        // Skip if this is our own join echo
        if (peerId === myPeerIdRef.current) return;

        // Add peer to list
        setRemotePeers((prev) => {
          if (prev.find((p) => p.peerId === peerId)) return prev;
          return [
            ...prev,
            { peerId, name: cleanName, stream: null, muted: false, cameraOff: false, email: peerEmail, avatar: peerAvatar },
          ];
        });

        // We are the initiator — create offer
        const pc = createPeerConnection(peerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        wsRef.current?.send(
          JSON.stringify({
            type: "offer",
            target: peerId,
            offer: offer,
            name: `${userNameRef.current}||${userRef.current?.email || ""}||${userRef.current?.avatar || ""}__${myUniqueIdRef.current}`,
          })
        );
      }

      else if (type === "peer_left") {
        removePeer(data.peer_id as string);
      }

      else if (type === "offer") {
        const senderId = data.sender as string;
        const rawName = data.name as string;
        
        const parts = rawName.split("__");
        const metadataPart = parts[0];
        const metaParts = metadataPart.split("||");
        const cleanName = metaParts[0];
        const peerEmail = metaParts[1] || "";
        const peerAvatar = metaParts[2] || "";

        // Add peer if not already tracked
        setRemotePeers((prev) => {
          if (prev.find((p) => p.peerId === senderId)) return prev;
          return [
            ...prev,
            { 
              peerId: senderId, 
              name: cleanName, 
              stream: null, 
              muted: false, 
              cameraOff: false, 
              email: peerEmail, 
              avatar: peerAvatar 
            },
          ];
        });

        const pc = createPeerConnection(senderId);
        await pc.setRemoteDescription(
          new RTCSessionDescription(data.offer as RTCSessionDescriptionInit)
        );
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        wsRef.current?.send(
          JSON.stringify({
            type: "answer",
            target: senderId,
            answer: answer,
          })
        );
      }

      else if (type === "answer") {
        const pc = peersRef.current.get(data.sender as string);
        if (pc) {
          await pc.setRemoteDescription(
            new RTCSessionDescription(data.answer as RTCSessionDescriptionInit)
          );
        }
      }

      else if (type === "ice_candidate") {
        const pc = peersRef.current.get(data.sender as string);
        if (pc && data.candidate) {
          try {
            await pc.addIceCandidate(
              new RTCIceCandidate(data.candidate as RTCIceCandidateInit)
            );
          } catch (e) {
            console.warn("ICE candidate error:", e);
          }
        }
      }

      else if (type === "chat") {
        const senderId = data.sender as string;
        const rawName = data.name as string;
        const parts = rawName.split("__");
        const metadataPart = parts[0];
        const metaParts = metadataPart.split("||");
        const cleanName = metaParts[0];
        const senderEmail = metaParts[1] || undefined;
        const senderAvatar = metaParts[2] || undefined;
        const message = data.message as string;

        // Parse custom control messages
        if (message.startsWith("__CONTROL__:request_admission:name=")) {
          if (isHostRef.current) {
            const reqName = message.replace("__CONTROL__:request_admission:name=", "");
            setPendingAdmissions((prev) => {
              if (prev.find((p) => p.peerId === senderId)) return prev;
              return [...prev, { peerId: senderId, name: reqName }];
            });
          }
          return;
        }

        if (message.startsWith("__CONTROL__:admit_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:admit_peer:peerId=", "");
          if (isHostRef.current) {
            setPendingAdmissions((prev) => prev.filter((p) => p.peerId !== targetPeerId));
          }
          return;
        }

        if (message.startsWith("__CONTROL__:deny_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:deny_peer:peerId=", "");
          if (isHostRef.current) {
            setPendingAdmissions((prev) => prev.filter((p) => p.peerId !== targetPeerId));
          }
          return;
        }

        if (message.startsWith("__CONTROL__:kick_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:kick_peer:peerId=", "");
          if (targetPeerId === myPeerIdRef.current) {
            if (onKickedRef.current) onKickedRef.current();
          }
          return;
        }

        if (message.startsWith("__CONTROL__:mute_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:mute_peer:peerId=", "");
          if (targetPeerId === myPeerIdRef.current) {
            if (onMutedByHostRef.current) onMutedByHostRef.current();
          }
          return;
        }

        if (message.startsWith("__CONTROL__:unmute_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:unmute_peer:peerId=", "");
          if (targetPeerId === myPeerIdRef.current) {
            if (onUnmutedByHostRef.current) onUnmutedByHostRef.current();
          }
          return;
        }

        if (message.startsWith("__CONTROL__:stop_video_peer:peerId=")) {
          const targetPeerId = message.replace("__CONTROL__:stop_video_peer:peerId=", "");
          if (targetPeerId === myPeerIdRef.current) {
            if (onCameraOffByHostRef.current) onCameraOffByHostRef.current();
          }
          return;
        }

        if (message === "__CONTROL__:meeting_ended") {
          setMeetingEnded(true);
          if (onMeetingEndedRef.current) {
            onMeetingEndedRef.current();
          }
          return;
        }

        if (message.startsWith("__CONTROL__:status:")) {
          const statusStr = message.replace("__CONTROL__:status:", "");
          const params = new URLSearchParams(statusStr.replace(/,/g, "&"));
          const isMuted = params.get("muted") === "true";
          const isCameraOff = params.get("cameraOff") === "true";

          console.log(`[Control] Remote peer ${cleanName} (${senderId}) status: muted=${isMuted}, cameraOff=${isCameraOff}`);

          setRemotePeers((prev) =>
            prev.map((p) =>
              p.peerId === senderId ? { ...p, muted: isMuted, cameraOff: isCameraOff } : p
            )
          );
          return;
        }

        if (message.startsWith("__CONTROL__:reaction:")) {
          const reactionStr = message.replace("__CONTROL__:reaction:", "");
          const params = new URLSearchParams(reactionStr);
          const emoji = params.get("emoji") || "";
          if (emoji && onRemoteReactionRef.current) {
            onRemoteReactionRef.current(emoji);
          }
          return;
        }

        // Standard chat message
        const isSelf = rawName.endsWith(`__${myUniqueIdRef.current}`);
        if (isSelf) return;

        setChatMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + Math.random()).toString(),
            sender: cleanName,
            text: message,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: false,
            senderEmail,
            senderAvatar,
          },
        ]);
      }
    },
    [createPeerConnection, removePeer]
  );

  // ── Lobby Broadcast Loop (Guest side) ──────────────────────────────────────
  useEffect(() => {
    if (isHost || admitted || !wsConnected) return;

    const requestAdmission = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "chat",
            message: `__CONTROL__:request_admission:name=${userNameRef.current}`,
            name: `${userNameRef.current}__${myUniqueIdRef.current}`,
          })
        );
      }
    };

    requestAdmission();
    const interval = setInterval(requestAdmission, 4000);

    return () => clearInterval(interval);
  }, [isHost, admitted, wsConnected]);

  // ── Connect WebSocket ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!meetingId || !localStream) return;

    const ws = new WebSocket(`${WS_BASE}/ws/meeting/${meetingId}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      // Everyone joins instantly
      ws.send(
        JSON.stringify({
          type: "join",
          name: `${userNameRef.current}||${userRef.current?.email || ""}||${userRef.current?.avatar || ""}__${myUniqueIdRef.current}`,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleMessage(data);
      } catch (e) {
        console.warn("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
    };

    ws.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };

    return () => {
      // Cleanup: close all peer connections and WebSocket
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
      ws.close();
      // Safety net: stop any active screen track so the browser's
      // native "Stop sharing" banner is dismissed immediately
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
    };

  }, [meetingId, localStream, handleMessage]);

  // ── Broadcast camera/mic status when they change ──────────────────────────
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && myPeerIdRef.current && admitted) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:status:muted=${!!muted},cameraOff=${!!cameraOff}`,
          name: `${userName}__${myUniqueIdRef.current}`,
        })
      );
    }
  }, [muted, cameraOff, userName, admitted]);

  // ── Send chat message ──────────────────────────────────────────────────────
  const sendChat = useCallback(
    (message: string) => {
      if (!message.trim() || !wsRef.current) return;

      // Add to local state immediately (optimistic)
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + Math.random()).toString(),
          sender: userName,
          text: message,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
          senderEmail: userRef.current?.email || undefined,
          senderAvatar: userRef.current?.avatar || undefined,
        },
      ]);

      // Send over WebSocket to all peers
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message,
          name: `${userName}||${userRef.current?.email || ""}||${userRef.current?.avatar || ""}__${myUniqueIdRef.current}`,
        })
      );
    },
    [userName]
  );

  // ── Replace Video Track Helper ─────────────────────────────────────────────
  const replaceVideoTrack = useCallback((track: MediaStreamTrack | null) => {
    screenTrackRef.current = track;
    peersRef.current.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) {
        sender.replaceTrack(track);
      }
    });
  }, []);

  // ── Administrative Commands ───────────────────────────────────────────────
  const admitPeer = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:admit_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
    setPendingAdmissions((prev) => prev.filter((p) => p.peerId !== peerId));
  }, []);

  const denyPeer = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:deny_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
    setPendingAdmissions((prev) => prev.filter((p) => p.peerId !== peerId));
  }, []);

  const admitAll = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pendingAdmissions.forEach((p) => {
        wsRef.current?.send(
          JSON.stringify({
            type: "chat",
            message: `__CONTROL__:admit_peer:peerId=${p.peerId}`,
            name: `${userNameRef.current}__${myUniqueIdRef.current}`,
          })
        );
      });
    }
    setPendingAdmissions([]);
  }, [pendingAdmissions]);

  const kickPeer = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:kick_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
  }, []);

  const muteParticipant = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:mute_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
  }, []);

  const unmuteParticipant = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:unmute_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
  }, []);

  const stopParticipantVideo = useCallback((peerId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: `__CONTROL__:stop_video_peer:peerId=${peerId}`,
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
  }, []);

  const endMeetingForAll = useCallback(async () => {
    try {
      if (meetingId) {
        await meetingAPI.endMeeting(meetingId);
      }
    } catch (err) {
      console.error("Failed to end meeting via API", err);
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          message: "__CONTROL__:meeting_ended",
          name: `${userNameRef.current}__${myUniqueIdRef.current}`,
        })
      );
    }
    setMeetingEnded(true);
  }, [meetingId]);

  return {
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
  };
}
