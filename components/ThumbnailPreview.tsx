"use client";
import React from "react";
import Image from "next/image";

export default function ThumbnailPreview({ url }: { url: string | null }) {
  if (!url) return null;

  // Handle base64 images (convert to blob URL for "open in tab")
  const isBase64 = url.startsWith("data:image");
  const openUrl = isBase64
    ? (() => {
        const byteString = atob(url.split(",")[1]);
        const mimeString = url.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        return URL.createObjectURL(blob);
      })()
    : url;

  return (
    <div className="mt-6">
      <div className="w-full max-w-[1280px] mx-auto bg-gradient-to-b from-black/40 to-transparent p-3 rounded-xl card-dashed">
        <Image
          src={url}
          alt="Generated YouTube thumbnail"
          width={1280}
          height={720}
          className="rounded-lg shadow-lg border border-dashed border-white/10"
        />
      </div>

      <div className="mt-3 flex gap-4">
        <a
          href={url}
          download="thumbnail.png"
          className="px-3 py-1 rounded-md bg-panel text-white text-sm border border-dashed border-white/20 hover:bg-accent hover:border-accent transition"
        >
          Download
        </a>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-md bg-panel text-white text-sm border border-dashed border-white/20 hover:bg-accent hover:border-accent transition"
        >
          Open in New Tab
        </a>
      </div>
    </div>
  );
}
