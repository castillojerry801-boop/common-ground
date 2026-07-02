"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Message = { role: "assistant" | "user"; content: string };

type ServiceStatus = { name: string; status: "healthy" | "degraded" | "down" };

interface FloClientProps {
  userEmail: string;
  stats: { userCount: number; orgCount: number };
  services: ServiceStatus[];
}

const STATUS_COLOR = {
  healthy: "text-emerald-400",
  degraded: "text-orange-400",
  down: "text-red-400",
};

const STATUS_DOT = {
  healthy: "bg-emerald-400",
  degraded: "bg-orange-400",
  down: "bg-red-400",
};

const STATUS_LABEL = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
};

function overallStatus(services: ServiceStatus[]): ServiceStatus["status"] {
  if (services.some((s) => s.status === "down")) return "down";
  if (services.some((s) => s.status === "degraded")) return "degraded";
  return "healthy";
}

export default function FloClient({ userEmail, stats, services }: FloClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefed, setBriefed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const health = overallStatus(services);

  const buildContext = useCallback(() => {
    const now = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const serviceLines = services
      .map((s) => `  ${s.name}: ${STATUS_LABEL[s.status]}`)
      .join("\n");
    return `Current time: ${now}
Platform users: ${stats.userCount}
Organizations: ${stats.orgCount}
Platform URL: cg-workshop.com — live
System services:\n${serviceLines}`;
  }, [stats, services]);

  const sendMessage = useCallback(
    async (userContent: string, history: Message[]) => {
      setLoading(true);
      const outgoing: Message = { role: "user", content: userContent };
      const updatedHistory = userContent ? [...history, outgoing] : history;
      if (userContent) setMessages(updatedHistory);

      const placeholder: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, placeholder]);

      try {
        const res = await fetch("/api/flo/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedHistory,
            context: buildContext(),
          }),
        });

        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(error ?? `HTTP ${res.status}`);
        }

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: full },
          ]);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content: `⚠️ ${message}`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [buildContext]
  );

  useEffect(() => {
    if (!briefed) {
      setBriefed(true);
      sendMessage("", [
        {
          role: "user",
          content: "Give me my operational brief. Start with health, then priorities.",
        },
      ]);
    }
  }, [briefed, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    await sendMessage(text, messages);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            FLO
          </span>
          <span className="text-zinc-700 text-xs">·</span>
          <span className="text-xs text-zinc-500">Common Ground</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[health]}`}
          />
          <span className={`text-xs font-medium ${STATUS_COLOR[health]}`}>
            {STATUS_LABEL[health]}
          </span>
          <span className="text-zinc-700 text-xs ml-3">·</span>
          <span className="text-xs text-zinc-600">{userEmail}</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dashboard panel */}
        <div className="hidden lg:flex flex-col w-[420px] shrink-0 border-r border-zinc-800/60 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Platform health */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                Platform Health
              </p>
              <div
                className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
                  health === "healthy"
                    ? "border-emerald-800/50 bg-emerald-950/20"
                    : health === "degraded"
                    ? "border-orange-800/50 bg-orange-950/20"
                    : "border-red-800/50 bg-red-950/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[health]}`}
                />
                <span className={`text-sm font-medium ${STATUS_COLOR[health]}`}>
                  {health === "healthy"
                    ? "All systems operational"
                    : health === "degraded"
                    ? "Service degradation detected"
                    : "Critical issue detected"}
                </span>
              </div>
            </section>

            {/* System status */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                System Status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {services.map((svc) => (
                  <div
                    key={svc.name}
                    className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5 flex items-center gap-2"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[svc.status]}`}
                    />
                    <span className="text-xs text-zinc-400 truncate">
                      {svc.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Platform stats */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                Platform Stats
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">
                    {stats.userCount}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Total users</p>
                </div>
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">
                    {stats.orgCount}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Organizations</p>
                </div>
              </div>
            </section>

            {/* Priorities */}
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                Today&apos;s Priorities
              </p>
              <div className="space-y-2">
                {stats.orgCount === 0 && (
                  <PriorityItem
                    level="todo"
                    text="Create your first organization"
                  />
                )}
                <PriorityItem level="todo" text="Configure GameFloHQ product" />
                <PriorityItem level="todo" text="Configure BeautyBook product" />
                <PriorityItem
                  level="healthy"
                  text="Platform deployed and live"
                />
                <PriorityItem level="healthy" text="Auth system operational" />
              </div>
            </section>
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center gap-2 text-zinc-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                FLO is preparing your brief…
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-3 mt-0.5 shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">
                      FLO
                    </span>
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-zinc-800 text-zinc-100 rounded-br-sm"
                      : "bg-zinc-900/60 border border-zinc-800/60 text-zinc-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content === "" && msg.role === "assistant" ? (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800/60 px-6 py-4 shrink-0">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask FLO anything…"
                disabled={loading}
                className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-zinc-950"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityItem({
  level,
  text,
}: {
  level: "fire" | "attention" | "todo" | "healthy";
  text: string;
}) {
  const dot: Record<string, string> = {
    fire: "bg-red-400",
    attention: "bg-orange-400",
    todo: "bg-yellow-400",
    healthy: "bg-emerald-400",
  };
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[level]}`} />
      <span className="text-sm text-zinc-400">{text}</span>
    </div>
  );
}
