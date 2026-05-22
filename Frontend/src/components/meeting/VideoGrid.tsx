"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { VideoTile } from "./VideoTile";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream | null;
  isYou?: boolean;
  muted?: boolean;
  cameraOff?: boolean;
  avatar?: string;
}

interface TileLayout {
  rows: number;
  cols: number;
  tileWidth: number;
  tileHeight: number;
}

interface VideoGridProps {
  participants: Participant[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ASPECT_RATIO = 16 / 9;
const GAP = 12; // px between tiles

// ─── Core Algorithm ───────────────────────────────────────────────────────────
//
// This is the same tile-area optimization algorithm used by Google Meet.
// Given N participants in a container of width W × height H,
// find the grid layout (rows × cols) that maximizes individual tile area
// while maintaining 16:9 aspect ratio.
//
// Time complexity: O(N) — iterates at most N possible row counts
// Space complexity: O(1)
//
function computeOptimalLayout(
  containerWidth: number,
  containerHeight: number,
  participantCount: number
): TileLayout {
  if (participantCount === 0) {
    return { rows: 0, cols: 0, tileWidth: 0, tileHeight: 0 };
  }

  let bestLayout: TileLayout = {
    rows: 1,
    cols: participantCount,
    tileWidth: 0,
    tileHeight: 0,
  };
  let bestArea = 0;

  // Try every possible number of rows from 1 to participantCount
  for (let rows = 1; rows <= participantCount; rows++) {
    const cols = Math.ceil(participantCount / rows);

    // Total gap space
    const totalGapX = GAP * (cols - 1);
    const totalGapY = GAP * (rows - 1);

    // Available space for tiles
    const availableWidth = containerWidth - totalGapX;
    const availableHeight = containerHeight - totalGapY;

    // Compute tile dimensions from width constraint
    const tileWidthFromW = availableWidth / cols;
    const tileHeightFromW = tileWidthFromW / ASPECT_RATIO;

    // Compute tile dimensions from height constraint
    const tileHeightFromH = availableHeight / rows;
    const tileWidthFromH = tileHeightFromH * ASPECT_RATIO;

    let tileWidth: number;
    let tileHeight: number;

    // Use whichever dimension fits within the container
    if (tileHeightFromW * rows <= availableHeight) {
      // Width is the binding constraint
      tileWidth = tileWidthFromW;
      tileHeight = tileHeightFromW;
    } else {
      // Height is the binding constraint
      tileWidth = tileWidthFromH;
      tileHeight = tileHeightFromH;
    }

    // Ensure dimensions are positive
    tileWidth = Math.max(0, tileWidth);
    tileHeight = Math.max(0, tileHeight);

    const area = tileWidth * tileHeight;

    if (area > bestArea) {
      bestArea = area;
      bestLayout = { rows, cols, tileWidth, tileHeight };
    }
  }

  return bestLayout;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VideoGrid({ participants }: VideoGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<TileLayout>({
    rows: 1,
    cols: 1,
    tileWidth: 0,
    tileHeight: 0,
  });

  // Recompute layout whenever container size or participant count changes
  const recompute = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const newLayout = computeOptimalLayout(width, height, participants.length);
    setLayout(newLayout);
  }, [participants.length]);

  // Use ResizeObserver to detect container size changes
  // This handles: window resize, sidebar collapse, panel open/close
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      recompute();
    });

    observer.observe(el);
    recompute(); // Initial computation

    return () => observer.disconnect(); // Cleanup on unmount
  }, [recompute]);

  // Recompute when participant count changes
  useEffect(() => {
    recompute();
  }, [participants.length, recompute]);

  // ── Render: Empty State ────────────────────────────────────────────────────
  if (participants.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-black"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A26] flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8888AA"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <p className="text-[#8888AA] text-sm">Waiting for participants...</p>
        </div>
      </div>
    );
  }

  // ── Render: Single Participant (special case — centered, max 900px) ─────────
  if (participants.length === 1) {
    return (
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-black p-4"
      >
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            aspectRatio: "16/9",
          }}
        >
          <VideoTile
            key={participants[0].id}
            name={participants[0].name}
            stream={participants[0].stream}
            isYou={participants[0].isYou}
            muted={participants[0].muted}
            cameraOff={participants[0].cameraOff}
            avatar={participants[0].avatar}
          />
        </div>
      </div>
    );
  }

  // ── Render: Multi-Participant Grid ─────────────────────────────────────────
  const { cols, tileWidth, tileHeight } = layout;

  // Calculate left padding to center the last row if it's not full
  const lastRowCount = participants.length % cols || cols;
  const isLastRowFull = lastRowCount === cols;

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-black overflow-hidden"
      style={{ padding: `${GAP}px` }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${tileWidth}px)`,
          gap: `${GAP}px`,
          justifyContent: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        {participants.map((participant, index) => {
          const isLastRow =
            index >= participants.length - lastRowCount;
          const isLastRowItem = isLastRow && !isLastRowFull;

          return (
            <div
              key={participant.id}
              style={{
                width: tileWidth,
                height: tileHeight,
                // Center last row items if grid is not full
                gridColumn: isLastRowItem
                  ? `span 1`
                  : undefined,
              }}
            >
              <VideoTile
                name={participant.name}
                stream={participant.stream}
                isYou={participant.isYou}
                muted={participant.muted}
                cameraOff={participant.cameraOff}
                avatar={participant.avatar}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VideoGrid;
