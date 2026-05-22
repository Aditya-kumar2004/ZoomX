"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  senderEmail?: string;
  senderAvatar?: string;
}

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (message: string) => void;
}

export function ChatPanel({ open, onClose, messages, onSend }: ChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    onSend(inputText.trim());
    setInputText("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 h-screen w-[300px] bg-[#111118] border-l border-[#1E1E2E] z-40 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#1E1E2E]">
            <span className="text-base font-bold text-white font-sora">Meeting Chat</span>
            <button onClick={onClose} className="text-[#8888AA] hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
            {messages.map((msg) => {
              const showAvatar = !!msg.senderAvatar;
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 items-start max-w-full ${
                    msg.isMe ? "flex-row-reverse self-end" : "flex-row self-start"
                  }`}
                >
                  {/* Avatar (only rendered if exists, otherwise absolutely nothing!) */}
                  {showAvatar && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.sender}
                      className="w-7 h-7 rounded-full border border-[#2D6FFF]/20 object-cover mt-0.5 shadow-sm shrink-0"
                    />
                  )}

                  {/* Message details & text */}
                  <div className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"} max-w-[210px]`}>
                    {/* Sender details (name and email) */}
                    <div className="flex flex-wrap items-center gap-1 mb-1 px-1">
                      <span className="text-[10px] text-white/80 font-bold tracking-wide">
                        {msg.isMe ? "You" : msg.sender}
                      </span>
                      {msg.senderEmail && (
                        <span className="text-[9px] text-[#8888AA] font-light max-w-[120px] truncate" title={msg.senderEmail}>
                          &lt;{msg.senderEmail}&gt;
                        </span>
                      )}
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`px-3 py-2 text-sm text-white leading-relaxed ${
                        msg.isMe
                          ? "bg-gradient-to-r from-[#2D6FFF]/30 to-[#2D6FFF]/15 border border-[#2D6FFF]/30 rounded-2xl rounded-tr-sm shadow-md"
                          : "bg-[#1A1A26]/80 border border-[#232336] rounded-2xl rounded-tl-sm shadow-md"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[9px] text-[#44445A] mt-1 px-1 select-none font-medium">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[#1E1E2E] p-3 flex gap-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputText.trim()) sendMessage();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-3 py-2 text-sm text-white placeholder:text-[#44445A] focus:outline-none focus:border-[#2D6FFF] transition"
            />
            <button onClick={sendMessage} className="bg-[#2D6FFF] p-2 rounded-lg hover:bg-[#1A5AE8] transition">
              <Send size={16} className="text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
