"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import {
  Upload,
  Sparkles,
  Monitor,
  Download,
  ExternalLink,
  Wand2,
  Copy,
  X,
  Zap,
  Archive,
  Settings,
  Video,
  Smartphone,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import UserRateLimit from "@/components/UserRateLimit";

interface ToastMessage {
  id: number;
  type: "success" | "error" | "info" | "warning";
  text: string;
}

// Type definitions
interface Resolution {
  label: string;
  value: string;
  aspect: "horizontal" | "vertical" | "square";
}

interface GeneratedThumbnail {
  url: string;
  resolution: string;
  aspect: "horizontal" | "vertical" | "square";
  label: string;
}

interface DialogData {
  videoType: string;
  style: string;
  mood: string;
  photoPosition: string;
  customText: string;
  colors: string;
  additionalDetails: string;
}

interface PromptTemplate {
  title: string;
  prompt: string;
}

// Constants
const promptTemplates: PromptTemplate[] = [
  {
    title: "Tech Tutorial",
    prompt: `Create a professional YouTube thumbnail in {resolution}. 
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
      "{resolution} YouTube thumbnail: young gamer celebrating victory, controller in hand, glowing effects around character, bold red text 'EPIC WIN!' in large font, vibrant background, simple high-contrast design",
  },
  {
    title: "Lifestyle Vlog",
    prompt:
      "{resolution} YouTube thumbnail: smiling vlogger outdoors, colorful casual background, bold white text 'MY DAILY LIFE' in large font, cheerful and clean look, friendly style that feels relatable",
  },
  {
    title: "Fitness",
    prompt:
      "{resolution} YouTube thumbnail: strong person exercising in gym, simple background with weights, bold white motivational text 'FIT INDIA' in large font, bright orange accents, clear and energetic style",
  },
];

const resolutions: Resolution[] = [
  { label: "YouTube Thumbnail", value: "1280x720", aspect: "horizontal" },
  { label: "YouTube Shorts", value: "1080x1920", aspect: "vertical" },
  { label: "Instagram Story", value: "1080x1920", aspect: "vertical" },
  { label: "Instagram Post", value: "1080x1080", aspect: "square" },
  { label: "Custom HD", value: "1920x1080", aspect: "horizontal" },
];

const videoTypes = [
  "Gaming",
  "Tech Tutorial",
  "Lifestyle Vlog",
  "Fitness",
  "Cooking",
  "Travel",
  "Music",
  "Education",
  "Comedy",
  "Review",
  "Tutorial",
  "Entertainment",
];

const styles = [
  "Professional",
  "Casual",
  "Energetic",
  "Minimalist",
  "Dark & Moody",
  "Bright & Colorful",
  "Cinematic",
  "Retro",
  "Futuristic",
  "Hand-drawn",
];

const moods = [
  "Exciting",
  "Calm",
  "Mysterious",
  "Happy",
  "Intense",
  "Inspiring",
  "Playful",
  "Serious",
  "Adventurous",
  "Cozy",
];

const photoPositions = [
  { label: "Left Side", value: "left" },
  { label: "Right Side", value: "right" },
  { label: "Center", value: "center" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
];

const questionnaire = [
  {
    step: 1,
    title: "Video Type",
    description:
      "This helps us understand the context and choose appropriate visual elements, fonts, and layouts for your content category.",
    field: "videoType" as keyof DialogData,
    type: "select",
    options: videoTypes,
    placeholder: "Select your video type...",
    required: true,
  },
  {
    step: 2,
    title: "Visual Style",
    description:
      "The overall aesthetic direction that will guide color schemes, typography, effects, and visual treatment of your thumbnail.",
    field: "style" as keyof DialogData,
    type: "select",
    options: styles,
    placeholder: "Choose your preferred style...",
    required: true,
  },
  {
    step: 3,
    title: "Emotional Mood",
    description:
      "The feeling you want viewers to experience when they see your thumbnail. This influences colors, lighting, expressions, and overall energy.",
    field: "mood" as keyof DialogData,
    type: "select",
    options: moods,
    placeholder: "What mood should it convey?",
    required: true,
  },
  {
    step: 4,
    title: "Photo Position",
    description:
      "Where your uploaded photo will be placed on the thumbnail. Consider leaving space for text and other design elements.",
    field: "photoPosition" as keyof DialogData,
    type: "select",
    options: photoPositions.map((p) => p.label),
    placeholder: "Choose photo placement...",
    required: false,
    showIf: (data: DialogData, hasImage: boolean) => hasImage,
  },
  {
    step: 5,
    title: "Main Text",
    description:
      "The headline text that will appear on your thumbnail. Keep it short, punchy, and attention-grabbing. Use ALL CAPS for maximum impact.",
    field: "customText" as keyof DialogData,
    type: "input",
    placeholder: "e.g., ULTIMATE GUIDE, AMAZING RESULTS, SECRET REVEALED...",
    required: false,
  },
  {
    step: 6,
    title: "Color Preferences",
    description:
      "Specific colors or color combinations you want to incorporate. This will override the default style colors if specified.",
    field: "colors" as keyof DialogData,
    type: "input",
    placeholder:
      "e.g., blue and orange, neon green, dark purple, red accents...",
    required: false,
  },
  {
    step: 7,
    title: "Special Elements",
    description:
      "Any specific visual elements, effects, or details you want included to make your thumbnail unique and eye-catching.",
    field: "additionalDetails" as keyof DialogData,
    type: "textarea",
    placeholder:
      "e.g., include gaming controller, add fire effects, show before/after, arrows pointing, explosion background...",
    required: false,
  },
];

export default function YoutubeThumbnailGenerator(): React.ReactElement {
  // State management
  const [prompt, setPrompt] = useState<string>("");
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedThumbnails, setGeneratedThumbnails] = useState<
    GeneratedThumbnail[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [enhancing, setEnhancing] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(
    resolutions[0]
  );
  const [generateBoth, setGenerateBoth] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dialog form state
  const [dialogData, setDialogData] = useState<DialogData>({
    videoType: "",
    style: "",
    mood: "",
    photoPosition: "right",
    customText: "",
    colors: "",
    additionalDetails: "",
  });

  // Helper functions
  const resetDialog = useCallback(() => {
    setCurrentStep(1);
    setDialogData({
      videoType: "",
      style: "",
      mood: "",
      photoPosition: "right",
      customText: "",
      colors: "",
      additionalDetails: "",
    });
  }, []);

  const showToast = useCallback(
    (text: string, type: ToastMessage["type"] = "info", duration = 4000) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, text }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setShowDialog(false);
    resetDialog();
  }, [resetDialog]);

  const handleTemplateSelect = useCallback(
    (templatePrompt: string) => {
      const promptWithResolution = templatePrompt.replace(
        "{resolution}",
        selectedResolution.value
      );
      setPrompt(promptWithResolution);
      setEnhancedPrompt("");
    },
    [selectedResolution.value]
  );

  const enhancePrompt = useCallback(async () => {
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
        showToast("✨ Prompt enhanced successfully!", "success");
      } else {
        showToast(`❌ Prompt enhancement failed: ${data.error}`, "error");
        // alert(data.error || "Failed to enhance prompt");
      }
    } catch (err) {
      console.error(err);
      showToast("❌ Prompt enhancement failed. Please try again.", "error");
      // alert("Failed to enhance prompt");
    } finally {
      setEnhancing(false);
    }
  }, [prompt]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          // alert("Upload failed");
          showToast(`❌ Image Upload failed"}`, "error");
        }

        showToast("✅ Image uploaded successfully!", "success");
      } catch (err) {
        console.error(err);
        // alert("Upload failed");
        showToast("❌ Upload failed. Please try again.", "error");
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const openQuestionnaireDialog = useCallback(() => {
    if (!prompt.trim()) {
      alert("Please enter a prompt first");
      return;
    }
    setShowDialog(true);
    setCurrentStep(1);
  }, [prompt]);

  const buildPromptFromDialog = useCallback((): string => {
    const {
      videoType,
      style,
      mood,
      photoPosition,
      customText,
      colors,
      additionalDetails,
    } = dialogData;

    let enhancedPrompt = `Create a professional ${selectedResolution.value} ${
      selectedResolution.aspect === "vertical"
        ? "vertical"
        : selectedResolution.aspect === "square"
        ? "square"
        : "horizontal"
    } thumbnail for a ${videoType} video. `;

    enhancedPrompt += `Visual Style: ${style} with ${mood} mood. `;

    enhancedPrompt += `The thumbnail should be optimized for ${
      selectedResolution.aspect === "vertical"
        ? "mobile viewing on YouTube Shorts, TikTok, and Instagram Stories"
        : selectedResolution.aspect === "square"
        ? "Instagram posts and social media feeds"
        : "desktop and mobile YouTube browsing"
    }. `;

    if (imageUrl) {
      const position =
        photoPositions.find((p) =>
          p.label.toLowerCase().includes(photoPosition.toLowerCase())
        )?.value || photoPosition;
      enhancedPrompt += `Place the uploaded person photo on the ${position} of the thumbnail with professional lighting and sharp contrast. `;
    }

    if (customText) {
      enhancedPrompt += `Include bold, eye-catching text that says: "${customText}". Make the text large, readable, and prominent. `;
    }

    if (colors) {
      enhancedPrompt += `Use color scheme: ${colors}. `;
    }

    enhancedPrompt += `Base concept: ${prompt}. `;

    if (additionalDetails) {
      enhancedPrompt += `Special elements to include: ${additionalDetails}. `;
    }

    enhancedPrompt += `Make it high-quality, professional, click-worthy, and optimized for maximum engagement. Use proper contrast, readable fonts, and compelling visual hierarchy. The thumbnail should stand out in search results and encourage clicks.`;

    return enhancedPrompt;
  }, [dialogData, selectedResolution, imageUrl, prompt]);

  const generateThumbnail = useCallback(
    async (useDialogData = false) => {
      const finalPrompt = useDialogData
        ? buildPromptFromDialog()
        : enhancedPrompt || prompt;
      if (!finalPrompt.trim()) {
        alert("Please enter a prompt first");
        return;
      }

      setLoading(true);
      const thumbnailsToGenerate: Array<{
        resolution: string;
        aspect: "horizontal" | "vertical" | "square";
        label: string;
      }> = [];

      if (generateBoth) {
        thumbnailsToGenerate.push(
          {
            resolution: "1280x720",
            aspect: "horizontal",
            label: "YouTube Thumbnail",
          },
          {
            resolution: "1080x1920",
            aspect: "vertical",
            label: "YouTube Shorts",
          }
        );
      } else {
        thumbnailsToGenerate.push({
          resolution: selectedResolution.value,
          aspect: selectedResolution.aspect,
          label: selectedResolution.label,
        });
      }

      try {
        const results: GeneratedThumbnail[] = [];

        for (const res of thumbnailsToGenerate) {
          const promptWithResolution = finalPrompt.replace(
            selectedResolution.value,
            res.resolution
          );

          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: promptWithResolution,
              imageUrl,
              resolution: res.resolution,
            }),
          });

          const data = await response.json();

          if (response.status === 429) {
            const waitSeconds = data.reset
              ? Math.ceil((data.reset - Date.now()) / 1000)
              : 0;
            showToast(
              `⚠️ Rate limit exceeded. Try again in ${
                waitSeconds || "a few"
              } seconds.`,
              "error"
            );
            return;
          }

          if (data.url) {
            results.push({
              url: data.url,
              resolution: res.resolution,
              aspect: res.aspect,
              label: res.label,
            });
            showToast("✅ Thumbnail generated successfully!", "success");
          }
        }

        if (results.length > 0) {
          setGeneratedThumbnails(results);
          if (useDialogData) {
            setEnhancedPrompt(finalPrompt);
          }
        } else {
          // alert("Generation failed");
          showToast("Image Genration failed, please retry");
        }
      } catch (err) {
        console.error(err);
        showToast("Image Genration failed, please retry");

        alert("Server error");
      } finally {
        setLoading(false);
        if (useDialogData) {
          closeDialog();
        }
      }
    },
    [
      enhancedPrompt,
      prompt,
      generateBoth,
      selectedResolution,
      imageUrl,
      buildPromptFromDialog,
      closeDialog,
    ]
  );

  const downloadAllThumbnails = useCallback(async () => {
    if (generatedThumbnails.length === 0) return;

    // Download each thumbnail individually
    generatedThumbnails.forEach((thumbnail, index) => {
      const link = document.createElement("a");
      link.href = thumbnail.url;
      link.download = `thumbnail_${thumbnail.resolution}_${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }, [generatedThumbnails]);

  const getDownloadUrl = useCallback((url: string): string => {
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
  }, []);

  const handleDialogFieldChange = useCallback(
    (field: keyof DialogData, value: string) => {
      setDialogData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const getCurrentQuestionnaireStep = useCallback(() => {
    return questionnaire.find((q) => q.step === currentStep);
  }, [currentStep]);

  const getVisibleSteps = useCallback(() => {
    return questionnaire.filter(
      (step) => !step.showIf || step.showIf(dialogData, Boolean(imageUrl))
    );
  }, [dialogData, imageUrl]);

  const canProceedToNextStep = useCallback(() => {
    const currentQ = getCurrentQuestionnaireStep();
    if (!currentQ) return false;

    if (currentQ.required) {
      const value = dialogData[currentQ.field];
      return Boolean(value && value.trim());
    }
    return true;
  }, [getCurrentQuestionnaireStep, dialogData]);

  const handleNextStep = useCallback(() => {
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(
      (step) => step.step === currentStep
    );
    if (currentIndex < visibleSteps.length - 1) {
      setCurrentStep(visibleSteps[currentIndex + 1].step);
    }
  }, [currentStep, getVisibleSteps]);

  const handlePreviousStep = useCallback(() => {
    const visibleSteps = getVisibleSteps();
    const currentIndex = visibleSteps.findIndex(
      (step) => step.step === currentStep
    );
    if (currentIndex > 0) {
      setCurrentStep(visibleSteps[currentIndex - 1].step);
    }
  }, [currentStep, getVisibleSteps]);

  const isLastStep = useCallback(() => {
    const visibleSteps = getVisibleSteps();
    return visibleSteps[visibleSteps.length - 1]?.step === currentStep;
  }, [currentStep, getVisibleSteps]);

  const isFirstStep = useCallback(() => {
    const visibleSteps = getVisibleSteps();
    return visibleSteps[0]?.step === currentStep;
  }, [currentStep, getVisibleSteps]);

  const renderQuestionnaireField = useCallback(
    (question: (typeof questionnaire)[0]) => {
      const value = dialogData[question.field];

      if (question.type === "select") {
        const options =
          question.field === "photoPosition"
            ? photoPositions.map((p) => p.label)
            : question.options || [];

        return (
          <select
            value={value}
            onChange={(e) =>
              handleDialogFieldChange(question.field, e.target.value)
            }
            className="w-full p-4 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg"
          >
            <option value="" className="bg-slate-800">
              {question.placeholder}
            </option>
            {options.map((option: string) => (
              <option key={option} value={option} className="bg-slate-800">
                {option}
              </option>
            ))}
          </select>
        );
      }

      if (question.type === "textarea") {
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleDialogFieldChange(question.field, e.target.value)
            }
            placeholder={question.placeholder}
            className="w-full p-4 h-24 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none text-lg"
          />
        );
      }

      return (
        <input
          type="text"
          value={value}
          onChange={(e) =>
            handleDialogFieldChange(question.field, e.target.value)
          }
          placeholder={question.placeholder}
          className="w-full p-4 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg"
        />
      );
    },
    [dialogData, handleDialogFieldChange]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="relative text-center mb-12">
          {/* User button top-right */}
          <div className="absolute top-4 right-4">
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Rate limit indicator */}
          <div className="absolute top-4 left-4">
            <UserRateLimit />
          </div>

          {/* Main title container */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-dashed border-purple-500/30 bg-purple-500/5 backdrop-blur-sm shadow-lg">
              <Monitor className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Thumbnail Generator - GenNail
              </h1>
            </div>

            <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Generate scroll-stopping YouTube thumbnails in seconds. Upload
              your photo, answer our smart questionnaire, and get both
              horizontal and vertical thumbnails perfectly optimized for any
              platform.
            </p>
          </div>

          {/* Optional tagline or quick action buttons */}
          <div className="mt-4 flex justify-center gap-3">
            <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-cyan-500 transition-all duration-200 shadow-md">
              Quick Start
            </button>
            <button className="px-5 py-2 border border-dashed border-purple-500/50 text-purple-300 rounded-xl hover:bg-purple-500/10 transition-all duration-200">
              Explore Templates
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Resolution Selection */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Resolution & Format
              </h2>
              <div className="space-y-3">
                <select
                  value={selectedResolution.value}
                  onChange={(e) => {
                    const selected = resolutions.find(
                      (r) => r.value === e.target.value
                    );
                    if (selected) setSelectedResolution(selected);
                  }}
                  className="w-full p-3 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                >
                  {resolutions.map((res, key) => (
                    <option
                      key={key}
                      value={res.value}
                      className="bg-slate-800"
                    >
                      {res.label} ({res.value})
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-green-500/50 bg-green-500/10 hover:bg-green-500/20 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={generateBoth}
                    onChange={(e) => setGenerateBoth(e.target.checked)}
                    className="w-4 h-4 text-green-500 bg-transparent border-2 border-green-500 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <div className="flex items-center gap-2 text-green-300">
                    <Video className="w-4 h-4" />
                    <Smartphone className="w-4 h-4" />
                    <span className="font-medium">
                      Generate Both Formats (Horizontal + Vertical)
                    </span>
                  </div>
                </label>
              </div>
            </div>

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
                Upload Your Photo
                <span className="text-sm font-normal text-slate-400">
                  (Optional)
                </span>
              </h2>
              <div className="space-y-4">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <div className="w-full p-6 rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 hover:bg-slate-600/20 hover:border-green-500/50 cursor-pointer transition-all duration-200 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <div className="text-slate-300 font-medium">
                      {uploading
                        ? "Uploading..."
                        : "Click to upload your photo"}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      PNG, JPG up to 10MB
                    </div>
                  </div>
                </label>

                {imageUrl && (
                  <div className="p-3 rounded-xl border border-dashed border-green-500/50 bg-green-500/10">
                    <div className="text-sm text-green-300">
                      ✓ Photo uploaded successfully
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="space-y-3">
              <button
                onClick={openQuestionnaireDialog}
                disabled={!prompt.trim() || loading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {loading ? "Generating..." : "Smart Generate (Recommended)"}
              </button>

              <button
                onClick={() => generateThumbnail(false)}
                disabled={loading || (!prompt.trim() && !enhancedPrompt.trim())}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-medium transition-all duration-200"
              >
                {loading ? "Generating..." : "Quick Generate"}
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-600/50 bg-slate-800/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  Preview{" "}
                  {generatedThumbnails.length > 0 &&
                    `(${generatedThumbnails.length})`}
                </h2>
                {generatedThumbnails.length > 1 && (
                  <button
                    onClick={downloadAllThumbnails}
                    className="px-4 py-2 rounded-xl border border-dashed border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-green-300 font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Download All
                  </button>
                )}
              </div>

              {generatedThumbnails.length === 0 ? (
                <div className="aspect-video rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <div>Your thumbnails will appear here</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedThumbnails.map((thumbnail, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">
                          {thumbnail.label} ({thumbnail.resolution})
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={thumbnail.url}
                            download={`thumbnail_${thumbnail.resolution}.png`}
                            className="p-2 rounded-lg border border-dashed border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-green-300 transition-all duration-200"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <a
                            href={getDownloadUrl(thumbnail.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-dashed border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <div
                        className={`${
                          thumbnail.aspect === "vertical"
                            ? "aspect-[9/16] max-w-xs mx-auto"
                            : thumbnail.aspect === "square"
                            ? "aspect-square max-w-sm mx-auto"
                            : "aspect-video"
                        } rounded-xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 overflow-hidden`}
                      >
                        <Image
                          src={thumbnail.url}
                          alt={`Generated ${thumbnail.label}`}
                          width={
                            thumbnail.aspect === "vertical"
                              ? 1080
                              : thumbnail.aspect === "square"
                              ? 1080
                              : 1280
                          }
                          height={
                            thumbnail.aspect === "vertical"
                              ? 1920
                              : thumbnail.aspect === "square"
                              ? 1080
                              : 720
                          }
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Smart Questionnaire Dialog */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600/50 p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Dialog Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Smart Thumbnail Generator
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Step {currentStep} of {getVisibleSteps().length}
                  </p>
                </div>
                <button
                  onClick={closeDialog}
                  className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (currentStep / getVisibleSteps().length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Dialog Content */}
              <div className="px-6 pb-6 overflow-y-auto max-h-[60vh]">
                {(() => {
                  const currentQ = getCurrentQuestionnaireStep();
                  if (!currentQ) return null;

                  // Skip step if showIf condition is false
                  if (
                    currentQ.showIf &&
                    !currentQ.showIf(dialogData, Boolean(imageUrl))
                  ) {
                    return null;
                  }

                  return (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {currentQ.title}{" "}
                          {currentQ.required && (
                            <span className="text-red-400">*</span>
                          )}
                        </h4>
                        <div className="flex items-start gap-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-300 text-sm leading-relaxed text-left">
                            {currentQ.description}
                          </p>
                        </div>
                      </div>

                      <div>{renderQuestionnaireField(currentQ)}</div>
                    </div>
                  );
                })()}
              </div>

              {/* Dialog Footer */}
              <div className="flex gap-3 p-6 border-t border-slate-600/50 bg-slate-800/50">
                <button
                  onClick={handlePreviousStep}
                  disabled={isFirstStep()}
                  className="flex items-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-600/50 bg-slate-700/30 hover:bg-slate-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-medium transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                {isLastStep() ? (
                  <button
                    onClick={() => generateThumbnail(true)}
                    disabled={
                      loading ||
                      !dialogData.videoType ||
                      !dialogData.style ||
                      !dialogData.mood
                    }
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    {loading
                      ? "Generating Amazing Thumbnail..."
                      : "Generate Smart Thumbnail"}
                  </button>
                ) : (
                  <button
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed font-medium text-white transition-all duration-200"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-dashed border-slate-600/50">
          <div className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Rajeev Bhardwaj • Crafted with{" "}
            <span className="text-red-400 font-medium">♥</span>
          </div>
        </footer>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative w-full max-w-xs px-5 py-3 rounded-2xl shadow-lg text-sm break-words 
              ${
                toast.type === "success"
                  ? "bg-green-600 text-white"
                  : toast.type === "error"
                  ? "bg-red-600 text-white"
                  : toast.type === "info"
                  ? "bg-blue-600 text-white"
                  : "bg-yellow-400 text-black"
              } 
              animate-slide-in`}
          >
            {toast.text}

            {/* Close button */}
            {/* <button
              onClick={() => removeToast(toast.id)}
              className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button> */}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-b-xl animate-progress-bar"></div>
          </div>
        ))}
      </div>

    </div>
  );
}
