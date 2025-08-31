import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { peekRateLimit, decrementRateLimit } from "@/lib/rateLimiter";
import { generateThumbnailImage } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Peek remaining limit
    const { remaining } = peekRateLimit(userId);
    if (remaining <= 0) {
      return NextResponse.json(
        { error: "Daily limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    const { prompt, imageUrl, resolution = "1280x720" } = await req.json();
    const url = await generateThumbnailImage(prompt, imageUrl, resolution);

    if (!url) {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    // ✅ Only decrement after successful generation
    const updated = decrementRateLimit(userId);

    return NextResponse.json({ url, remaining: updated.remaining });
  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
