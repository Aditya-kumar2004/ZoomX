"use client";
import { useEffect, useRef } from "react";

interface EmojiReactionProps {
  emoji: string | null;
  onComplete: () => void;
}

export default function EmojiReaction({ emoji, onComplete }: EmojiReactionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated with the latest onComplete callback reference
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!emoji || !ref.current) return;
    const el = ref.current;
    el.style.left = `${20 + Math.random() * 60}vw`;
    el.style.bottom = "80px";
    el.style.opacity = "1";
    el.style.transform = "translateY(0) scale(1)";

    const anim = el.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 1, transform: "translateY(-100px) scale(1.2)", offset: 0.5 },
        { opacity: 0, transform: "translateY(-200px) scale(0.8)" },
      ],
      { duration: 2000, easing: "ease-out", fill: "forwards" },
    );

    anim.onfinish = () => {
      onCompleteRef.current();
    };

    return () => anim.cancel();
  }, [emoji]);

  if (!emoji) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 pointer-events-none text-4xl select-none"
      style={{ bottom: "80px" }}
    >
      {emoji}
    </div>
  );
}
