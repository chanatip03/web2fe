"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProjectPreviewPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // 1. Kickstart the backend preview
    const startPreview = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${id}/preview/start`,
          {
            method: "POST",
            credentials: "include",
          },
        );
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        const data = await res.json();
        console.log(data);

        // If already successful/running from previous deploy
        if (data.status === "success" || data.status === "running") {
          setStatus("ready");
          setPreviewUrl(data.preview_url);
          return;
        }

        // 2. Poll the status otherwise
        const poll = setInterval(async () => {
          const sRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/project/${id}/preview/status`,
            {
              credentials: "include",
            },
          );
          const sData = await sRes.json();
          if (sData.status === "success" || sData.status === "running") {
            clearInterval(poll);
            setStatus("ready");
            setPreviewUrl(sData.preview_url);
          } else if (sData.status === "error" || sData.status === "failed") {
            clearInterval(poll);
            setStatus("error");
            setError(sData.error || "Deployment failed to start");
          } else {
            setStatus("deploying");
          }
        }, 3000);
      } catch (err: any) {
        setStatus("error");
        setError(err.message);
      }
    };

    startPreview();
  }, [id]);

  if (status === "loading" || status === "deploying") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white flex-col gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-t-white animate-spin"></div>
        <p className="font-semibold text-lg">
          {status === "loading"
            ? "Initializing Container Environment..."
            : "Deploying your application..."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-screen items-center justify-center bg-red-900 text-white p-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-bold mb-4">Preview Unavailable</h1>
          <p className="bg-black/30 p-4 rounded-xl font-mono">{error}</p>
        </div>
      </div>
    );
  }

  if (status === "ready" && previewUrl) {
    // Determine exact absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    const fullUrl = previewUrl.startsWith("http")
      ? previewUrl
      : `${baseUrl}${previewUrl}`;

    console.log("🔥 PREVIEW IFRAME URL:", fullUrl);

    return (
      <div className="w-full h-screen overflow-hidden bg-white">
        <div className="h-12 bg-gray-100 border-b flex items-center px-4 justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">
              Project Engine Preview
            </span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold font-mono">
              LIVE
            </span>
          </div>
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium bg-white px-3 py-1 rounded shadow-sm border border-gray-200 transition text-sm"
          >
            Open in new tab ↗
          </a>
        </div>
        <iframe
          src={fullUrl}
          className="w-full h-[calc(100vh-3rem)] border-0"
          allow="clipboard-read; clipboard-write; microphone; camera"
        />
      </div>
    );
  }

  return null;
}
