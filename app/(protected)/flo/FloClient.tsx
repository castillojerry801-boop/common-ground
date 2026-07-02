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
const STATUS_LABEL = { healthy: "Healthy", degraded: "Degraded", down: "Down" };

function overallStatus(services: ServiceStatus[]): ServiceStatus["status"] {
  if (services.some((s) => s.status === "down")) return "down";
  if (services.some((s) => s.status === "degraded")) return "degraded";
  return "healthy";
}

// Strip emoji and markdown symbols so TTS sounds natural
function cleanForSpeech(text: string): string {
  return text
    .replace(/[🔴🟠🟡🟢⚠️]/gu, "")
    .replace(/\*\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/`/g, "")
    .trim();
}

export default function FloClient({ userEmail, stats, services }: FloClientProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefed, setBriefed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const voiceOutputRef = useRef(voiceOutput);
  voiceOutputRef.current = voiceOutput;

  const health = overallStatus(services);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setSpeechSupported(supported);
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceOutputRef.current || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanForSpeech(text));
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    // Prefer a natural-sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Google US English") ||
        v.name.includes("Alex")
    );
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  }, []);

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
      window.speechSynthesis?.cancel();

      const outgoing: Message = { role: "user", content: userContent };
      const updatedHistory = userContent ? [...history, outgoing] : history;
      if (userContent) setMessages(updatedHistory);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/flo/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedHistory, context: buildContext() }),
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

        speak(full);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `⚠️ ${message}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [buildContext, speak]
  );

  // Initial brief on mount
  useEffect(() => {
    if (!briefed) {
      setBriefed(true);
      sendMessage("", [
        { role: "user", content: "Give me my operational brief. Start with health, then priorities." },
      ]);
    }
  }, [briefed, sendMessage]);

  // Auto-scroll
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

  function startListening() {
    if (!speechSupported || isListening) return;
    window.speechSynthesis?.cancel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: { results: { isFinal: boolean; [index: number]: { transcript: string } }[] }) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-send whatever was captured
      setInput((current) => {
        const text = current.trim();
        if (text) {
          setTimeout(() => {
            setInput("");
            sendMessage(text, messages);
          }, 0);
        }
        return current;
      });
    };

    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">FLO</span>
          <span className="text-zinc-700 text-xs">·</span>
          <span className="text-xs text-zinc-500">Common Ground</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Voice output toggle */}
          <button
            onClick={() => {
              if (voiceOutput) window.speechSynthesis?.cancel();
              setVoiceOutput((v) => !v);
            }}
            title={voiceOutput ? "Mute FLO" : "Unmute FLO"}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              voiceOutput
                ? "border-amber-700/60 text-amber-400 bg-amber-950/30"
                : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {voiceOutput ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M9.172 9.172L12 12m0 0l2.828 2.828M12 12L9.172 9.172M12 12l2.828-2.828" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.071 4.929a10 10 0 010 14.142" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
            {voiceOutput ? "Voice on" : "Voice off"}
          </button>

          <span className="text-zinc-700 text-xs">·</span>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[health]}`} />
          <span className={`text-xs font-medium ${STATUS_COLOR[health]}`}>{STATUS_LABEL[health]}</span>
          <span className="text-zinc-700 text-xs">·</span>
          <span className="text-xs text-zinc-600">{userEmail}</span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Dashboard panel */}
        <div className="hidden lg:flex flex-col w-[420px] shrink-0 border-r border-zinc-800/60 overflow-y-auto">
          <div className="p-6 space-y-6">
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">Platform Health</p>
              <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${
                health === "healthy" ? "border-emerald-800/50 bg-emerald-950/20"
                : health === "degraded" ? "border-orange-800/50 bg-orange-950/20"
                : "border-red-800/50 bg-red-950/20"
              }`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[health]}`} />
                <span className={`text-sm font-medium ${STATUS_COLOR[health]}`}>
                  {health === "healthy" ? "All systems operational"
                    : health === "degraded" ? "Service degradation detected"
                    : "Critical issue detected"}
                </span>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">System Status</p>
              <div className="grid grid-cols-2 gap-2">
                {services.map((svc) => (
                  <div key={svc.name} className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[svc.status]}`} />
                    <span className="text-xs text-zinc-400 truncate">{svc.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">Platform Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">{stats.userCount}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Total users</p>
                </div>
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">{stats.orgCount}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Organizations</p>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">Today&apos;s Priorities</p>
              <div className="space-y-2">
                {stats.orgCount === 0 && <PriorityItem level="todo" text="Create your first organization" />}
                <PriorityItem level="todo" text="Configure GameFloHQ product" />
                <PriorityItem level="todo" text="Configure BeautyBook product" />
                <PriorityItem level="healthy" text="Platform deployed and live" />
                <PriorityItem level="healthy" text="Auth system operational" />
              </div>
            </section>
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center gap-2 text-zinc-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                FLO is preparing your brief…
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="mr-3 mt-0.5 shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">FLO</span>
                  </div>
                )}
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-zinc-800 text-zinc-100 rounded-br-sm"
                    : "bg-zinc-900/60 border border-zinc-800/60 text-zinc-200 rounded-bl-sm"
                }`}>
                  {msg.content === "" && msg.role === "assistant" ? (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:300ms]" />
                    </span>
                  ) : msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Listening indicator */}
          {isListening && (
            <div className="px-6 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs text-red-400">Listening… speak now</span>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-zinc-800/60 px-6 py-4 shrink-0">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              {/* Mic button */}
              {speechSupported && (
                <button
                  type="button"
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onTouchStart={startListening}
                  onTouchEnd={stopListening}
                  onClick={isListening ? stopListening : startListening}
                  disabled={loading}
                  title="Hold to speak"
                  className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 ${
                    isListening
                      ? "border-red-500 bg-red-950/40 text-red-400"
                      : "border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {isListening ? (
                    <span className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              )}

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening…" : "Ask FLO anything…"}
                disabled={loading || isListening}
                className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || !input.trim() || isListening}
                className="shrink-0 w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriorityItem({ level, text }: { level: "fire" | "attention" | "todo" | "healthy"; text: string }) {
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
