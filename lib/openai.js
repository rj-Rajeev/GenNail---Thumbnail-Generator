import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateThumbnailImage(prompt, imageUrl) {
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-image-preview:free", // image-capable model
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: `You are an expert YouTube thumbnail designer. 
            Always generate thumbnails with 1280x720 resolution, high contrast, 
            clear text readability, and eye-catching visuals that increase CTR.`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Create a 1280x720 YouTube thumbnail for: ${prompt}, using the provided image if it contains a human, otherwise use it only as reference.`,
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
    modalities: ["text", "image"], // ✅ allow image responses
    size: "1280x720", // ✅ force correct size
  });

  // The model should return an image URL
  const image = response.choices?.[0]?.message?.images?.find(
    (c) => c.type === "image_url"
  )?.image_url?.url;

  return image ?? null;
}
