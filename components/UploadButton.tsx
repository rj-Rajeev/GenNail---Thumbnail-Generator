"use client";
import React, { useState } from "react";

export default function UploadButton({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setLoading(false);
    if (data.url) onUpload(data.url);
    else console.error("Upload failed", data);
  }

  return (
    <div className="flex items-center gap-3">
      <label className="px-3 py-2 rounded-md cursor-pointer card-dashed">
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <span className="text-sm text-[#cfd6dd]">Upload image</span>
      </label>
      {loading && <span className="text-sm text-subtle">Uploading...</span>}
    </div>
  );
}
