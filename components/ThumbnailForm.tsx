"use client";
import React, { useState } from "react";
import UploadButton from "./UploadButton";
import StepCheckbox from "./StepCheckbox";

export default function ThumbnailForm({
  onGenerated,
}: {
  onGenerated: (url: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [steps, setSteps] = useState({
    creativeBrieF: true,
    uploadImage: false,
    review: false,
  });

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageUrl }),
      });
      const data = await res.json();
      if (data.url) onGenerated(data.url);
      else alert(data.error || "Generation failed");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl p-6 rounded-2xl card-dashed">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">Create Thumbnail</h2>
        <p className="text-subtle mt-1">
          Follow steps to craft a perfect thumbnail
        </p>
      </div>

      <div className="space-y-3">
        <StepCheckbox
          checked={steps.creativeBrieF}
          onToggle={() =>
            setSteps((s) => ({ ...s, creativeBrieF: !s.creativeBrieF }))
          }
          title="1 — Creative brief"
          desc="Write a clear instruction: subject, mood, text, colors, style"
        />

        <div className="p-3 rounded-md bg-transparent">
          <textarea
            className="w-full p-3 bg-transparent border border-dashed rounded-md text-white"
            placeholder="E.g. 'Tech tutorial thumbnail: close-up laptop, excited host, big text: '5 VS 50 CSS TRICKS'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>

        <StepCheckbox
          checked={!!imageUrl}
          onToggle={() =>
            setSteps((s) => ({ ...s, uploadImage: !s.uploadImage }))
          }
          title="2 — Optional image"
          desc="Upload a face/logo to be composited into the thumbnail"
        />

        <UploadButton
          onUpload={(u) => {
            setImageUrl(u);
            setSteps((s) => ({ ...s, uploadImage: true }));
          }}
        />

        <StepCheckbox
          checked={steps.review}
          onToggle={() => setSteps((s) => ({ ...s, review: !s.review }))}
          title="3 — Review & generate"
          desc="Preview choices and generate the thumbnail"
        />

        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2 rounded-md text-white bg-gradient-to-r from-[#6e54ff] to-[#8b6bff] shadow-glow"
            onClick={generate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Thumbnail"}
          </button>
        </div>
      </div>
    </div>
  );
}
