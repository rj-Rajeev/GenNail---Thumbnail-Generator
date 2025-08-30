import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Call LLM to enhance prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any text-only model on OpenRouter
      messages: [
        {
          role: "system",
          content: `You are an expert prompt engineer. 
            Improve and rewrite the user prompt for maximum creativity, 
            clarity, and effectiveness without changing its intent.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const enhancedPrompt =
      completion.choices?.[0]?.message?.content?.trim() ?? null;

    if (!enhancedPrompt) {
      return NextResponse.json(
        { error: "Failed to enhance prompt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhancedPrompt });
  } catch (err: unknown) {
    console.error("Enhance API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
