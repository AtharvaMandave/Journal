import { NextResponse } from "next/server";
import crypto from "crypto";

// In-memory captcha store (replace with Redis/DB in production)
const captchaStore = new Map();

function generateCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET() {
  try {
    const captcha = generateCaptcha();
    const sessionId = crypto.randomUUID();

    captchaStore.set(sessionId, {
      code: captcha,
      expires: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // Clean expired captchas
    for (const [key, value] of captchaStore.entries()) {
      if (value.expires < Date.now()) {
        captchaStore.delete(key);
      }
    }

    return NextResponse.json({
      success: true,
      captcha,
      sessionId,
    });
  } catch (err) {
    console.error("Captcha error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate captcha" },
      { status: 500 }
    );
  }
}

// Export store so /contact can use it
export { captchaStore };
