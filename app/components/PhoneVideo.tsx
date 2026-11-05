"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneMockup } from "@/app/components/PhoneMockup";

/** Something said at the table while the clip plays, timed to the recording. */
export type Cue = {
  from: number;
  to: number;
  name: string;
  color: string;
  text: string;
  /** The speaker changes their mind mid-sentence: from `at`, the bubble says `text` instead. */
  then?: { at: number; text: string };
  /** Which side of the phone the speaker sits on. */
  side: "left" | "right";
  /** Height on the phone, 0 (top) to 1 (bottom). */
  y: number;
};

type Props = {
  /** A real screen recording, sped up only where nothing happens. */
  src: string;
  poster: string;
  label: string;
  cues?: Cue[];
  tilt?: "left" | "right" | "none";
  width?: string;
  className?: string;
  /**
   * Leave out to let the clip run itself: loop while on screen. Pass it to drive the clip
   * from outside (the steps play one after another): it plays once while true, and goes
   * back to its first frame when false.
   */
  playing?: boolean;
  /** Called when a driven clip reaches its last frame. */
  onEnded?: () => void;
  /** Change it to start a driven clip over from the top. */
  take?: number;
};

// How long the speaker stalls (a small "no" shake) before the bubble changes its words.
const STALL = 0.5;

// A phone playing a real screen recording. The speech bubbles follow the clip's clock, so
// "Two." lands just before the tap. They belong to the people around the table, not to
// the phone: each one comes from a player sitting just out of shot.
export function PhoneVideo({ src, poster, label, cues = [], tilt = "none", width, className, playing, onEnded, take }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const driven = playing !== undefined;
  // the clip's clock in tenths, so the page re-renders ten times a second at most
  const [t, setT] = useState(0);

  // Self-run: play while on screen, loop.
  useEffect(() => {
    if (driven) return;
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !still) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [driven]);

  // Driven: play from the start when switched on, rewind when switched off.
  useEffect(() => {
    if (!driven) return;
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [driven, playing, take]);

  // Bubbles follow the clip's clock while it runs.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || cues.length === 0) return;
    let raf = 0;
    const read = () => setT(Math.round(video.currentTime * 10) / 10);
    const tick = () => {
      read();
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      read();
    };
    // a rewind lands while the clip may already be running again: only settle if it's paused
    const seeked = () => (video.paused ? stop() : read());
    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    video.addEventListener("seeked", seeked);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
      video.removeEventListener("seeked", seeked);
    };
  }, [cues.length]);

  return (
    <div ref={wrapRef} className={`relative${className ? ` ${className}` : ""}`}>
      <PhoneMockup tilt={tilt} width={width}>
        <video
          ref={videoRef}
          className="phone__video"
          src={src}
          poster={poster}
          muted
          loop={!driven}
          playsInline
          preload="metadata"
          aria-label={label}
          onEnded={driven ? onEnded : undefined}
        />
      </PhoneMockup>
      {cues.map((c) => {
        const on = t >= c.from && t < c.to;
        const changed = c.then !== undefined && t >= c.then.at;
        const stalling = c.then !== undefined && !changed && t >= c.then.at - STALL;
        const text = changed && c.then ? c.then.text : c.text;
        return (
          <span
            key={`${c.name}-${c.from}`}
            className={`bubble bubble--${c.side}`}
            data-on={on ? "true" : undefined}
            style={{ top: `${c.y * 100}%`, ["--who" as string]: c.color }}
            aria-hidden="true"
          >
            {/* the speaker, sitting just out of shot */}
            <span className="bubble__who">{c.name[0]}</span>
            <span className="bubble__box" data-stall={stalling ? "true" : undefined}>
              <span className="bubble__name">{c.name}</span>
              <span key={text} className="bubble__text" data-swap={changed ? "true" : undefined}>
                {text}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
