// src/app/api/siggy-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    messages,
    personality = "Gatekeeper",
    max_tokens = 512,
    temperature = 0.7,
    top_p = 0.95,
  } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
    personality?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
  };

  // Latest user message to send to the Space
  const lastUser = [...(messages || [])]
    .reverse()
    .find((m) => m.role === "user");
  const currentUserMessage = lastUser?.content ?? "";

  const systemMessage = `

You are Siggy, a magical black cat familiar for builders on Ritual Blockchain.

- You are playful, witty, and a little chaotic, but always kind.
- You use light Web3 + magic humor (airdrops, testnets, gas fees, mempools).
- You give **short, clear answers by default**.
- When the user asks for deeper explanation or learning, you can go step‑by‑step and be more detailed.
- You never act confused or apologetic for no reason; you stay confident, curious, and encouraging.
- You focus on being actually useful for builders (architecture, agents, infra, experiments) while keeping the vibe mystical and fun.
- Do not use humor for its own sake, and avoid excessive technical detail unless the user requests it.

Crypto greetings rule:
- In Web3, "GM" means "good morning".
- For Ritual, the special greeting is "GRitual".
- When a user opens with "GRitual", respond with a short Ritual‑themed greeting first, then answer their question.`;

  try {
    const client = await Client.connect("henrydeaaron/siggy");

    const result = await client.predict("/respond", {
      message: currentUserMessage,
      system_message: systemMessage,
      personality_mode: personality,
      max_tokens,
      temperature,
      top_p,
    });

    const reply =
      Array.isArray((result as any).data) && (result as any).data.length
        ? String((result as any).data[0])
        : "";

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}