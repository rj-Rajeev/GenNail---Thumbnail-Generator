// lib/openai.ts
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateThumbnailImage(
  prompt,
  imageUrl,
  resolution = "1280x720"
) {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-image-preview:free",
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: `You are a professional YouTube thumbnail designer. 
              Always generate **high-quality thumbnails** with:
              - Correct resolution: ${resolution}
              - Bold, readable text that stands out
              - Strong visual hierarchy
              - High contrast and vibrant colors
              - Composition optimized for YouTube CTR
              - If a human photo is provided, place them prominently with good lighting.
              - Leave space for title text if applicable.
              -  give extra focus on resolution, it should be ${resolution}`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a ${resolution} thumbnail for: ${prompt}. 
              Use the provided image if relevant.`,
            },
            ...(imageUrl
              ? [
                  {
                    type: "image_url",
                    image_url: { url: imageUrl },
                  },
                ]
              : []),
          ],
        },
      ],
      modalities: ["image"],
      size: resolution,
    });

    // Ensure we grab an image if available
    const image =
      response.choices?.[0]?.message?.images?.find(
        (c) => c.type === "image_url"
      )?.image_url?.url ?? null;

    return image;
  } catch (err) {
    console.error("❌ OpenAI Error:", err);
    return null;
  }
}
