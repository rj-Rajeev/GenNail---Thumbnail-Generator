import { NextResponse } from "next/server";
import { generateThumbnailImage } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { prompt, imageUrl } = await req.json();
    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Prompt is too short" },
        { status: 400 }
      );
    }

    const url = await generateThumbnailImage(prompt, imageUrl);
    if (!url)
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
