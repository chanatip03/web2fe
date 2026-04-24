"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

const TTL_SECONDS = 2 * 60 * 60; // 2 hours — must match backend

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ProjectPreviewPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(TTL_SECONDS);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown ticker — starts once the container is running
  const startCountdown = (remaining: number) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSecondsLeft(remaining);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          setStatus("expired");
          setPreviewUrl(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!id) return;

    const startPreview = async () => {
      try {
        // Submission preview uses deployment subsystem endpoints:
        // POST /api/project/{submission_id}/preview/start then poll /status
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${id}/preview/start`,
          { method: "POST", credentials: "include" }
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        const data = await res.json();

        if (data.status === "running") {
          setStatus("ready");
          setPreviewUrl(data.preview_url);
          startCountdown(data.seconds_remaining ?? TTL_SECONDS);
          return;
        }

        // Status is "starting" — begin polling
        setStatus("deploying");
        pollRef.current = setInterval(async () => {
          try {
            const sRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/project/${id}/preview/status`,
              { method: "GET", credentials: "include" }
            );
            if (!sRes.ok) {
              const text = await sRes.text();
              throw new Error(text);
            }
            const sData = await sRes.json();

            if (sData.status === "running") {
              clearInterval(pollRef.current!);
              setStatus("ready");
              setPreviewUrl(sData.preview_url);
              startCountdown(sData.seconds_remaining ?? TTL_SECONDS);
            } else if (sData.status === "error") {
              clearInterval(pollRef.current!);
              setStatus("error");
              setError(sData.error ?? "Container failed to start");
            }
          } catch {
            // network hiccup — keep polling
          }
        }, 3000);
      } catch (err: unknown) {
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    startPreview();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [id]);

  // ── Loading / Starting ───────────────────────────────────────────────────
  if (status === "loading" || status === "deploying") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white flex-col gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-400 animate-spin" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-white">
            {status === "loading"
              ? "Initialising Container Environment…"
              : "Pulling & Launching Docker Container…"}
          </p>
          <p className="text-sm text-gray-400">
            This usually takes 30–60 seconds. Please wait.
          </p>
        </div>

        {/* Step hints */}
        <div className="flex flex-col gap-2 text-sm text-gray-400 bg-white/5 rounded-xl px-6 py-4 max-w-xs w-full">
          {[
            "Downloading bundle from storage",
            "Loading Docker images",
            "Starting containers",
            "Waiting for service health",
          ].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white p-6">
        <div className="max-w-xl w-full text-center space-y-4">
          <div className="text-5xl">🚫</div>
          <h1 className="text-2xl font-bold">Preview Unavailable</h1>
          <p className="text-gray-400 text-sm">
            The container failed to start. Check that your bundle was built
            successfully and that Docker is running on the server.
          </p>
          <pre className="bg-red-950/60 border border-red-500/30 text-red-300 p-4 rounded-xl font-mono text-xs text-left overflow-auto">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  // ── Expired ───────────────────────────────────────────────────────────────
  if (status === "expired") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-5xl">⏰</div>
          <h1 className="text-2xl font-bold">Session Expired</h1>
          <p className="text-gray-400 text-sm">
            The 2-hour preview has ended and the container was automatically
            removed to free resources.
          </p>
          <button
            onClick={() => {
              setStatus("loading");
              setPreviewUrl(null);
              setError(null);
              window.location.reload();
            }}
            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition"
          >
            Restart Preview
          </button>
        </div>
      </div>
    );
  }

  // ── Ready (iframe) ────────────────────────────────────────────────────────
  if (status === "ready" && previewUrl) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "";
    const fullUrl = previewUrl.startsWith("http")
      ? previewUrl
      : `${baseUrl}${previewUrl}`;

    const isWarning = secondsLeft < 10 * 60; // < 10 min → red

    return (
      <div className="w-full h-screen flex flex-col overflow-hidden bg-gray-950">
        {/* Top bar */}
        <div className="h-11 bg-gray-900 border-b border-white/10 flex items-center px-4 gap-3 shrink-0">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* URL bar */}
          <div className="flex-1 bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-300 font-mono truncate select-all">
            {fullUrl}
          </div>

          {/* Countdown */}
          <div
            className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-md ${
              isWarning
                ? "bg-red-900/60 text-red-300"
                : "bg-gray-800 text-gray-300"
            }`}
            title="Container auto-removes after 2 hours"
          >
            <span>⏱</span>
            <span>{formatCountdown(secondsLeft)}</span>
          </div>

          {/* Open in tab */}
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-300 hover:text-indigo-200 hover:underline font-medium transition whitespace-nowrap"
          >
            Open ↗
          </a>
        </div>

        {/* Preview iframe */}
        <iframe
          src={fullUrl}
          className="flex-1 border-0 w-full"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    );
  }

  return null;
}
