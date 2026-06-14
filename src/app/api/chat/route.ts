import { NextRequest, NextResponse } from "next/server";
import { getChatResponse } from "@/lib/gemini";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  history: z
    .array(z.object({ role: z.string(), content: z.string() }))
    .max(20)
    .optional()
    .default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Validation failed" }, { status: 400 });
    }

    const { message, history } = parsed.data;
    const reply = await getChatResponse(message, history);

    return NextResponse.json({ success: true, message: "Response generated", data: { reply } });
  } catch (error) {
    return NextResponse.json({ success: false, message: "AI service error" }, { status: 500 });
  }
}