"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

/*
 * Website analytics (the app itself has none). Same setup as lucapulv.com and
 * the same PostHog project, so both sites show up together (filter by $host):
 * - persistence "memory": no cookies or local storage, so no consent banner
 * - all form inputs masked in replays
 * - EU cloud, proxied through /ingest (see next.config.ts)
 * Visitors arriving from lucapulv.com carry ph_did/ph_sid in the URL, so the
 * journey continues as the same visitor and session. Only runs on the real site.
 */
const POSTHOG_TOKEN = "phc_OEjc7D6wscpLtipQze2DxrM0C8aF6V5ejiAWNR94UNu"; // EU project
const OWNER_COOKIE = "lp-owner"; // set on .lucapulv.com from lucapulv.com/backstage
const NO_NOTIFY_KEY = "no-notify";

// Luca's own devices: the shared owner cookie, or ?notrack=1 once on this site.
function isOwnerDevice() {
  try {
    const url = new URL(window.location.href);
    const flag = url.searchParams.get("notrack");
    if (flag !== null) {
      if (flag === "0") localStorage.removeItem(NO_NOTIFY_KEY);
      else localStorage.setItem(NO_NOTIFY_KEY, "1");
      url.searchParams.delete("notrack");
      window.history.replaceState(window.history.state, "", url.toString());
    }
    if (document.cookie.split("; ").includes(`${OWNER_COOKIE}=1`)) return true;
    return Boolean(localStorage.getItem(NO_NOTIFY_KEY));
  } catch {
    return false;
  }
}

// Reads (and strips from the address bar) the IDs handed over by lucapulv.com.
function takeHandoff() {
  try {
    const url = new URL(window.location.href);
    const distinctID = url.searchParams.get("ph_did");
    const sessionID = url.searchParams.get("ph_sid");
    if (!distinctID && !sessionID) return undefined;
    url.searchParams.delete("ph_did");
    url.searchParams.delete("ph_sid");
    window.history.replaceState(window.history.state, "", url.toString());
    return { distinctID, sessionID };
  } catch {
    return undefined;
  }
}

export default function SiteAnalytics() {
  useEffect(() => {
    const handoff = takeHandoff();
    if (!window.location.hostname.endsWith("lucapulv.com")) return;
    if (posthog.__loaded || isOwnerDevice()) return;
    posthog.init(POSTHOG_TOKEN, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      persistence: "memory",
      person_profiles: "identified_only",
      bootstrap: handoff,
      capture_pageview: "history_change",
      capture_pageleave: true,
      session_recording: { maskAllInputs: true },
      enable_recording_console_log: true,
      capture_exceptions: true,
      enable_heatmaps: true,
      capture_dead_clicks: true,
      capture_performance: { web_vitals: true },
    });
  }, []);

  const skipOwner = <T,>(event: T) => (typeof document !== "undefined" && isOwnerDevice() ? null : event);
  return (
    <>
      <Analytics beforeSend={skipOwner} />
      <SpeedInsights beforeSend={skipOwner} />
    </>
  );
}
