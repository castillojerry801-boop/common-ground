"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CGMark } from "@/app/components/ui/CGMark";

type Message = { role: "assistant" | "user"; content: string };
type ServiceStatus = { name: string; status: "healthy" | "degraded" | "down" };
type ContactSubmission = {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string | null;
  business_type: string;
  business_description: string | null;
  looking_for: string;
  notes: string | null;
  read: boolean;
  created_at: string;
};

interface FloClientProps {
  userEmail: string;
  stats: { userCount: number; orgCount: number; inquiryCount: number };
  services: ServiceStatus[];
  recentInquiries: ContactSubmission[];
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

function overallStatus(s: ServiceStatus[]): ServiceStatus["status"] {
  if (s.some((x) => x.status === "down")) return "down";
  if (s.some((x) => x.status === "degraded")) return "degraded";
  return "healthy";
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/[🔴🟠🟡🟢⚠️]/gu, "")
    .replace(/\*\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/`/g, "")
    .trim();
}

export default function FloClient({ userEmail, stats, services, recentInquiries: initialInquiries }: FloClientProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);

  function removeInquiry(id: string) {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [briefed, setBriefed] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micAlwaysOn, setMicAlwaysOn] = useState(true);   // owner default: on
  const [voiceOutput, setVoiceOutput] = useState(true);    // owner default: on
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const micAlwaysOnRef = useRef(micAlwaysOn);
  micAlwaysOnRef.current = micAlwaysOn;
  const voiceOutputRef = useRef(voiceOutput);
  voiceOutputRef.current = voiceOutput;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  // Streaming TTS queue — stores pre-fetched blob promises so audio is ready immediately
  const ttsQueueRef = useRef<Promise<Blob | null>[]>([]);
  const isTtsPlayingRef = useRef(false);
  const ttsStreamDoneRef = useRef(false);
  const ttsOnDoneRef = useRef<(() => void) | undefined>(undefined);
  const pendingTtsRef = useRef("");

  const health = overallStatus(services);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    setSpeechSupported(ok);
  }, []);

  const fetchAudioBlob = (text: string): Promise<Blob | null> =>
    fetch("/api/flo/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: cleanForSpeech(text) }),
    }).then(r => r.ok ? r.blob() : null).catch(() => null);

  // ── Streaming TTS queue ───────────────────────────────────────────────────
  // Awaits the next pre-fetched blob promise and plays it, then chains.
  const drainTtsQueue = useCallback(async () => {
    if (isTtsPlayingRef.current) return;
    if (ttsQueueRef.current.length === 0) {
      if (ttsStreamDoneRef.current) {
        setIsSpeaking(false);
        ttsOnDoneRef.current?.();
        ttsOnDoneRef.current = undefined;
      }
      return;
    }

    if (!voiceOutputRef.current) {
      ttsQueueRef.current = [];
      setIsSpeaking(false);
      ttsOnDoneRef.current?.();
      ttsOnDoneRef.current = undefined;
      return;
    }

    const blobPromise = ttsQueueRef.current.shift()!;
    isTtsPlayingRef.current = true;

    try {
      const blob = await blobPromise; // resolves instantly if already prefetched
      if (!blob) throw new Error("No blob");

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      const onFinish = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        isTtsPlayingRef.current = false;
        drainTtsQueue();
      };
      audio.onended = onFinish;
      audio.onerror = onFinish;
      await audio.play();
    } catch {
      isTtsPlayingRef.current = false;
      drainTtsQueue();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enqueueTts = useCallback((text: string) => {
    if (!text.trim() || !voiceOutputRef.current) return;
    // Fire fetch immediately so audio is ready before it's needed
    ttsQueueRef.current.push(fetchAudioBlob(text));
    if (!isTtsPlayingRef.current) {
      setIsSpeaking(true);
      drainTtsQueue();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drainTtsQueue]);

  // ── Voice output via OpenAI TTS (single-shot, non-streaming) ─────────────
  const speak = useCallback(async (text: string, onDone?: () => void) => {
    if (!voiceOutputRef.current) { onDone?.(); return; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    ttsQueueRef.current = [fetchAudioBlob(text)];
    isTtsPlayingRef.current = false;
    ttsStreamDoneRef.current = true;
    ttsOnDoneRef.current = onDone;
    setIsSpeaking(true);
    drainTtsQueue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drainTtsQueue]);

  // ── Microphone ────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!speechSupported || loadingRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    // Abort existing session
    recognitionRef.current?.abort();

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: {
      results: { isFinal: boolean; [i: number]: { transcript: string } }[];
    }) => {
      // Reset silence timer on every new speech input
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setInput(transcript);

      // Stop and send after 2.5s of silence so natural pauses don't cut off mid-thought
      silenceTimerRef.current = setTimeout(() => {
        recognitionRef.current?.stop();
      }, 2500);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setIsListening(false);
      setInput((current) => {
        const text = current.trim();
        if (text && !loadingRef.current) {
          setTimeout(() => {
            setInput("");
            // Capture current messages via ref so closure is fresh
            const history = messagesRef.current;
            sendMessageRef.current(text, history);
          }, 0);
        }
        return current;
      });
    };

    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [speechSupported]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (userContent: string, history: Message[]) => {
      // Pause mic while FLO is thinking / speaking
      recognitionRef.current?.abort();
      setIsListening(false);

      setLoading(true);

      // Reset TTS state for new response
      pendingTtsRef.current = "";
      ttsQueueRef.current = [] as Promise<Blob | null>[];
      isTtsPlayingRef.current = false;
      ttsStreamDoneRef.current = false;
      ttsOnDoneRef.current = undefined;
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setIsSpeaking(false);

      const outgoing: Message = { role: "user", content: userContent };
      const updatedHistory = userContent ? [...history, outgoing] : history;
      if (userContent) setMessages(updatedHistory);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const buildContext = () => {
        const now = new Date().toLocaleString("en-US", {
          weekday: "long", year: "numeric", month: "long",
          day: "numeric", hour: "2-digit", minute: "2-digit",
        });
        const inquiryList = inquiries.length > 0
          ? inquiries.map((inq) =>
              `  [${inq.id}] ${inq.full_name} | ${inq.business_name} | ${BUSINESS_TYPE_LABEL[inq.business_type] ?? inq.business_type} | ${new Date(inq.created_at).toLocaleDateString()}`
            ).join("\n")
          : "  None";

        return `Current time: ${now}
Platform users: ${stats.userCount}
Organizations: ${stats.orgCount}
Contact inquiries: ${stats.inquiryCount}
Recent inquiries (id | name | business | type | date):\n${inquiryList}
Platform URL: cg-workshop.com — live
System services:\n${services.map((s) => `  ${s.name}: ${STATUS_LABEL[s.status]}`).join("\n")}`;
      };

      let full = "";
      try {
        const res = await fetch("/api/flo/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedHistory,
            context: buildContext(),
            localDate: new Date().toLocaleString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
              hour: "numeric", minute: "2-digit", timeZoneName: "short",
            }),
          }),
        });

        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(error ?? `HTTP ${res.status}`);
        }
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;

          // Detect complete sentences and enqueue TTS immediately
          if (voiceOutputRef.current) {
            pendingTtsRef.current += chunk;
            const m = pendingTtsRef.current.match(/^([\s\S]*[.!?])\s+([\s\S]*)$/);
            if (m) {
              pendingTtsRef.current = m[2];
              enqueueTts(m[1].trim());
            }
          }

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: full },
          ]);
        }
      } catch (err: unknown) {
        full = `⚠️ ${err instanceof Error ? err.message : "Unknown error"}`;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: full },
        ]);
      } finally {
        setLoading(false);
      }

      // Mark stream done; speak any remaining text, then resume mic
      ttsStreamDoneRef.current = true;
      ttsOnDoneRef.current = () => {
        if (micAlwaysOnRef.current) startListening();
      };

      if (full && !full.startsWith("⚠️") && voiceOutputRef.current) {
        const remaining = pendingTtsRef.current.trim();
        if (remaining) {
          enqueueTts(remaining);
        } else if (!isTtsPlayingRef.current && ttsQueueRef.current.length === 0) {
          // Nothing was queued at all (very short response with no sentence boundary)
          speak(full, () => { if (micAlwaysOnRef.current) startListening(); });
        } else if (!isTtsPlayingRef.current) {
          // Queue drained before stream ended — fire done callback now
          setIsSpeaking(false);
          if (micAlwaysOnRef.current) startListening();
          ttsOnDoneRef.current = undefined;
        }
        // else: queue is still draining and onDone ref is set — it'll fire when done
      } else if (!voiceOutputRef.current && micAlwaysOnRef.current) {
        startListening();
      }
    },
    [stats, services, speak, enqueueTts, startListening]
  );

  // Keep a stable ref to sendMessage for use inside closures
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  // Initial brief
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

  // When micAlwaysOn toggled ON, start immediately if idle
  useEffect(() => {
    if (micAlwaysOn && !loading && !isSpeaking && !isListening) {
      startListening();
    }
    if (!micAlwaysOn) {
      stopListening();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micAlwaysOn]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading || isListening) return;
    setInput("");
    await sendMessage(text, messages);
    inputRef.current?.focus();
  }

  function toggleMic() {
    if (isListening) { stopListening(); setMicAlwaysOn(false); }
    else { setMicAlwaysOn(true); startListening(); }
  }

  function stopSpeaking() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    ttsQueueRef.current = [];
    isTtsPlayingRef.current = false;
    ttsStreamDoneRef.current = true;
    ttsOnDoneRef.current = undefined;
    setIsSpeaking(false);
    if (micAlwaysOnRef.current) startListening();
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/60 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <CGMark size={26} color="#f59e0b" />
          <div className="w-px h-5 bg-zinc-700" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">FLO</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Voice output toggle */}
          <button
            onClick={() => {
              if (voiceOutput && audioRef.current) { audioRef.current.pause(); audioRef.current = null; setIsSpeaking(false); }
              setVoiceOutput((v) => !v);
            }}
            title={voiceOutput ? "Mute FLO" : "Unmute FLO"}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              voiceOutput
                ? "border-amber-700/60 text-amber-400 bg-amber-950/30"
                : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {voiceOutput ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0c-1.657 0-3-1.343-3-3V9a3 3 0 016 0v6c0 1.657-1.343 3-3 3zm0 0v3.75M19.071 4.929a10 10 0 010 14.142" />
              ) : (
                <>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </>
              )}
            </svg>
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
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">{stats.userCount}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Users</p>
                </div>
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-zinc-50 tracking-tight">{stats.orgCount}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Orgs</p>
                </div>
                <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-3">
                  <p className="text-2xl font-bold text-amber-400 tracking-tight">{stats.inquiryCount}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">Inquiries</p>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">
                Recent Inquiries
              </p>
              {inquiries.length === 0 ? (
                <p className="text-xs text-zinc-700 py-2">No inquiries yet.</p>
              ) : (
                <div className="space-y-2">
                  {inquiries.map((inq) => (
                    <InquiryCard key={inq.id} inquiry={inq} onDelete={removeInquiry} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600 mb-3">Quick Links</p>
              <Link
                href="/flo/toolbox"
                className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-900/40 px-3 py-2.5 hover:bg-zinc-800/40 hover:border-zinc-700/60 transition-colors group"
              >
                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">Toolbox</p>
                  <p className="text-[11px] text-zinc-600">Prompt library · Copy &amp; paste</p>
                </div>
                <svg className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 ml-auto shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
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

          {/* Status bar above input */}
          <div className="px-6 pt-2 pb-1 flex items-center gap-3 min-h-[28px]">
            {isListening && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                </span>
                <span className="text-xs text-red-400">Listening…</span>
              </div>
            )}
            {isSpeaking && !isListening && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span className="text-xs text-amber-400">FLO is speaking</span>
                <button onClick={stopSpeaking} className="text-[11px] text-zinc-600 hover:text-zinc-400 underline ml-1">
                  stop
                </button>
              </div>
            )}
            {loading && !isListening && !isSpeaking && (
              <span className="text-xs text-zinc-600">FLO is thinking…</span>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800/60 px-6 py-4 shrink-0">
            <form onSubmit={handleSend} className="flex gap-3 items-center">
              {/* Mic toggle */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={loading || isSpeaking}
                  title={micAlwaysOn ? "Mic on — click to turn off" : "Mic off — click to turn on"}
                  className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all disabled:opacity-30 ${
                    isListening
                      ? "border-red-500 bg-red-950/40 text-red-400"
                      : micAlwaysOn
                      ? "border-amber-600/60 bg-amber-950/20 text-amber-400"
                      : "border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {isListening ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400" />
                    </span>
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

const BUSINESS_TYPE_LABEL: Record<string, string> = {
  salon_spa_beauty: "Salon / Spa / Beauty",
  trainer_coach: "Trainer / Coach",
  youth_sports: "Youth Sports",
  restaurant_bar_catering: "Restaurant / Bar / Catering",
  contractor_home_service: "Contractor / Home Service",
  retail_local_shop: "Retail / Local Shop",
  nonprofit_community: "Nonprofit / Community",
  event_camp_clinic: "Event / Camp / Clinic",
  other: "Other",
};

function InquiryCard({ inquiry, onDelete }: { inquiry: ContactSubmission; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const date = new Date(inquiry.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    try {
      const res = await fetch(`/api/contact/${inquiry.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(inquiry.id);
      } else {
        setConfirming(false);
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-3 py-2.5 flex items-start justify-between gap-2 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-200 truncate">{inquiry.full_name}</p>
          <p className="text-[11px] text-zinc-500 truncate">{inquiry.business_name}</p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] text-zinc-600">{date}</span>
          <span className="text-[10px] font-medium text-amber-500/80">
            {BUSINESS_TYPE_LABEL[inquiry.business_type] ?? inquiry.business_type}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-zinc-800/60 space-y-2">
          {inquiry.business_description && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">About their business</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{inquiry.business_description}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">Looking for</p>
            <p className="text-xs text-zinc-300 leading-relaxed">{inquiry.looking_for}</p>
          </div>
          {inquiry.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">Anything else</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{inquiry.notes}</p>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex gap-3">
              <a href={`mailto:${inquiry.email}`} className="text-[11px] text-amber-500 hover:text-amber-400 transition-colors">
                {inquiry.email}
              </a>
              {inquiry.phone && (
                <span className="text-[11px] text-zinc-600">{inquiry.phone}</span>
              )}
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className={`text-[11px] transition-colors disabled:opacity-40 ${
                confirming ? "text-red-400 hover:text-red-300" : "text-zinc-700 hover:text-red-400"
              }`}
            >
              {deleting ? "Deleting…" : confirming ? "Confirm delete" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PriorityItem({ level, text }: { level: "fire" | "attention" | "todo" | "healthy"; text: string }) {
  const dot: Record<string, string> = {
    fire: "bg-red-400", attention: "bg-orange-400", todo: "bg-yellow-400", healthy: "bg-emerald-400",
  };
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot[level]}`} />
      <span className="text-sm text-zinc-400">{text}</span>
    </div>
  );
}
