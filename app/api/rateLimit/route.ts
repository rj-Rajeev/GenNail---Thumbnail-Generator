// app/api/rateLimit/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { peekRateLimit } from "@/lib/rateLimiter";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Peek remaining daily limit
    const { remaining } = peekRateLimit(userId);

    // Calculate reset time (midnight)
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // next midnight
    const reset = midnight.getTime();

    return NextResponse.json({
      remaining,
      reset,
    });
  } catch (err) {
    console.error("❌ Rate Limit API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
