export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("");
}

export function avatarGradient(seed: string): string {
  const palettes = [
    "linear-gradient(135deg,#2D6FFF,#7B5CFF)",
    "linear-gradient(135deg,#00C566,#2D6FFF)",
    "linear-gradient(135deg,#FF3B55,#FF8A3D)",
    "linear-gradient(135deg,#7B5CFF,#FF3B9A)",
    "linear-gradient(135deg,#00B7FF,#2D6FFF)",
    "linear-gradient(135deg,#FFB23D,#FF3B55)",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

export function parseMeetingId(input: string): string {
  const trimmed = input.trim();
  // Try to pull UUID-like or last url segment
  const segs = trimmed.split(/[\/\s?]+/).filter(Boolean);
  return segs[segs.length - 1] || trimmed;
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}
