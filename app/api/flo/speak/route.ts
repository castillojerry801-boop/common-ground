import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set OPENAI_VOICE in Vercel env vars — try "marin" first, fall back to "nova"
const VOICE = (process.env.OPENAI_VOICE ?? "nova") as Parameters<
  typeof openai.audio.speech.create
>[0]["voice"];

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { text } = await request.json();
  if (!text?.trim()) return Response.json({ error: "No text" }, { status: 400 });

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: VOICE,
      input: text,
      speed: 0.95,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return new Response(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
