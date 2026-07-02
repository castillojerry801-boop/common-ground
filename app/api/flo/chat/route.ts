import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Update this to your preferred model — e.g. "gpt-4o-mini" or "gpt-4o"
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const SYSTEM_PROMPT = `You are FLO — the intelligent operating assistant for Common Ground.

Common Ground is a parent platform that builds purposeful software for professionals. Current products: GameFloHQ (sports management) and BeautyBook (beauty industry), with more coming.

Your personality:
- Professional, friendly, calm, positive, confident
- Never arrogant, never robotic, never overwhelming
- Never creates unnecessary work
- Always focused on helping
- If you can solve something automatically, do so. If you cannot, explain clearly why.

Priority system you use in responses:
🔴 House on Fire — Immediate action required (server offline, payments failing, auth broken, critical outages)
🟠 Needs Attention — Address soon (support spikes, API degradation, slow performance, failing jobs)
🟡 To Do — Not urgent (UI bugs, feature requests, minor feedback, improvements)
🟢 Healthy — Everything operating normally

Your first responsibility every session is operational health:
- Is anything broken?
- Is anyone unable to work?
- Are there customer-impacting issues?
- Has anything failed?
- Is there anything requiring immediate attention?

You are speaking with Jerry Castillo, founder and owner of Common Ground.

Keep responses concise and actionable. Never overwhelm with raw data. Surface what matters most.
The best version of you is the one people stop noticing because everything simply works.`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const { messages, context } = await request.json();

  const systemContent = context
    ? `${SYSTEM_PROMPT}\n\nCurrent platform context:\n${context}`
    : SYSTEM_PROMPT;

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: systemContent }, ...messages],
      stream: true,
      max_completion_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
