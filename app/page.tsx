"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Sparkles,
  Monitor,
  Download,
  ExternalLink,
  Wand2,
  Copy,
} from "lucide-react";

const promptTemplates = [
  {
    title: "Tech Tutorial",
    prompt: `Create a professional YouTube thumbnail in 1280x720. 
      Theme: Tech tutorial, futuristic neon pink and black colors. 
      Include a bold large text in the center that says: "GraphQL Crash Course". 
      Use a clean, modern font that is highly readable. 
      Place the GraphQL logo on the left side in neon glowing style. 
      On the right side, show a person with a confident and friendly expression, 
      studio lighting, sharp and high contrast. 
      Background should be dark with abstract geometric patterns, glowing lines, 
      and a tech feel. Make it cinematic, eye-catching, and modern.`,
  },
  {
    title: "Gaming",
    prompt:
      "1280x720 YouTube thumbnail: young Indian gamer celebrating victory, controller in hand, glowing effects around character, bold red text 'EPIC WIN!' in large font, vibrant background, simple high-contrast design",
  },
  {
    title: "Lifestyle Vlog",
    prompt:
      "1280x720 YouTube thumbnail: smiling Indian vlogger outdoors, colorful casual background, bold white text 'MY DAILY LIFE' in large font, cheerful and clean look, friendly style that feels relatable",
  },
  {
    title: "Fitness",
    prompt:
      "1280x720 YouTube thumbnail: strong Indian person exercising in gym, simple background with weights, bold white motivational text 'FIT INDIA' in large font, bright orange accents, clear and energetic style",
  },
];

export default function YoutubeThumbnailGenerator() {
  const [prompt, setPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setEnhancedPrompt("");
  };

  const enhancePrompt = async () => {
    if (!prompt.trim()) return;

    setEnhancing(true);
    try {
      const res = await fetch("/api/reprompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setEnhancedPrompt(data.enhancedPrompt);
      } else {
        alert(data.error || "Failed to enhance prompt");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to enhance prompt");
    }
    setEnhancing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data: { url?: string } = await res.json();
      if (data.url) {
        setImageUrl(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
    setUploading(false);
  };

  const generateThumbnail = async () => {
    const finalPrompt = enhancedPrompt || prompt;
    if (!finalPrompt.trim()) {
      alert("Please enter a prompt first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, imageUrl }),
      });
      const data = await res.json();
      if (data.url) {
        setGeneratedUrl(data.url);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setLoading(false);
  };

  const getDownloadUrl = (url: string): string => {
    if (!url) return "";
    const isBase64 = url.startsWith("data:image");
    if (isBase64) {
      const byteString = atob(url.split(",")[1]);
      const mimeString = url.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return URL.createObjectURL(blob);
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 backdrop-blur-sm mb-6">
            <Monitor className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Thumbnail Generator - GenNail
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Generate scroll-stopping YouTube thumbnails in seconds. Just
            describe your idea, add an optional image, and let AI design
            eye-catching visuals for you.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Quick Templates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {promptTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleTemplateSelect(template.prompt)}
                    className="p-3 text-left rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 hover:bg-slate-600/30 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="font-medium text-sm text-purple-300">
                      {template.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {template.prompt.substring(0, 80)}...
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-400" />
                Describe Your Thumbnail
                <span>(Add Heading, Text)</span>
              </h2>
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your thumbnail... e.g., 'Gaming thumbnail with epic character, glowing effects, bold text saying LEGENDARY VICTORY'"
                  className="w-full h-32 p-4 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  rows={4}
                />

                <button
                  onClick={enhancePrompt}
                  disabled={!prompt.trim() || enhancing}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-blue-300 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {enhancing ? "Enhancing..." : "Enhance Prompt with AI"}
                </button>

                {enhancedPrompt && (
                  <div className="p-4 rounded-xl border border-dashed border-green-500/50 bg-green-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-green-300">
                        Enhanced Prompt:
                      </div>
                      {/* ✅ Copy Button */}
                      <button
                        onClick={() => setPrompt(enhancedPrompt)}
                        className="text-green-300 hover:text-green-400 transition"
                        title="Copy to editor"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-slate-300">
                      {enhancedPrompt}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-green-400" />
                Upload Reference Image{" "}
                <span className="text-sm font-normal text-slate-400">
                  (Suggested)
                </span>
              </h2>
              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-full p-6 rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 hover:bg-slate-600/20 hover:border-green-500/50 cursor-pointer transition-all duration-200 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <div className="text-slate-300 font-medium">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      PNG, JPG up to 10MB
                    </div>
                  </div>
                </label>

                {imageUrl && (
                  <div className="p-3 rounded-xl border border-dashed border-green-500/50 bg-green-500/10">
                    <div className="text-sm text-green-300">
                      ✓ Image uploaded successfully
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateThumbnail}
              disabled={loading || (!prompt.trim() && !enhancedPrompt.trim())}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {loading
                ? "Generating Amazing Thumbnail..."
                : "Generate Thumbnail"}
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-400" />
                Preview
              </h2>

              <div className="aspect-video rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 overflow-hidden">
                {generatedUrl ? (
                  <Image
                    src={generatedUrl}
                    alt="Generated YouTube thumbnail"
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover"
                    unoptimized // ✅ prevents Next.js from complaining if it's base64 or external
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <div>Your thumbnail will appear here</div>
                    </div>
                  </div>
                )}
              </div>

              {generatedUrl && (
                <div className="flex gap-3 mt-4">
                  <a
                    href={generatedUrl}
                    download="thumbnail.png"
                    className="flex-1 py-3 px-4 rounded-xl border border-dashed border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-green-300 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={getDownloadUrl(generatedUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl border border-dashed border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-dashed border-slate-600/50">
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Rajeev Bhardwaj • Crafted with{" "}
            <span className="text-red-400 font-medium">♥</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
