"use client";

import { useState } from "react";
import Link from "next/link";
import { CGMedallion } from "@/app/components/ui/CGMark";

const TOTAL_STEPS = 7;

const DESIGN_STYLES = [
  {
    id: "modern",
    label: "Modern",
    bg: "bg-zinc-950",
    text: "text-zinc-50",
    accent: "border-zinc-700",
    preview: "Clean lines. Sharp contrast. Geometric forms.",
  },
  {
    id: "luxury",
    label: "Luxury",
    bg: "bg-[#1a1408]",
    text: "text-amber-300",
    accent: "border-amber-700/50",
    preview: "Gold tones. Elevated presence. Quiet confidence.",
  },
  {
    id: "minimal",
    label: "Minimal",
    bg: "bg-white",
    text: "text-zinc-500",
    accent: "border-zinc-200",
    preview: "White space. Restraint. Nothing unnecessary.",
    darkText: true,
  },
  {
    id: "industrial",
    label: "Industrial",
    bg: "bg-zinc-800",
    text: "text-zinc-200",
    accent: "border-zinc-600",
    preview: "Raw. Structural. Built to work.",
  },
  {
    id: "rustic",
    label: "Rustic",
    bg: "bg-[#2c1f0e]",
    text: "text-amber-200",
    accent: "border-amber-900/60",
    preview: "Warm tones. Handcrafted feel. Grounded.",
  },
  {
    id: "corporate",
    label: "Corporate",
    bg: "bg-[#0f1e3c]",
    text: "text-blue-200",
    accent: "border-blue-800/60",
    preview: "Professional. Trustworthy. Structured.",
  },
  {
    id: "bold",
    label: "Bold",
    bg: "bg-zinc-950",
    text: "text-white",
    accent: "border-white/30",
    preview: "Big type. High contrast. Unapologetic.",
    bigText: true,
  },
  {
    id: "friendly",
    label: "Friendly",
    bg: "bg-amber-50",
    text: "text-amber-900",
    accent: "border-amber-200",
    preview: "Warm. Approachable. Feels like home.",
    darkText: true,
  },
  {
    id: "premium",
    label: "Premium",
    bg: "bg-[#0a0a0a]",
    text: "text-zinc-300",
    accent: "border-zinc-800",
    preview: "Dark. Refined. Detail-obsessed.",
  },
  {
    id: "high_energy",
    label: "High Energy",
    bg: "bg-zinc-950",
    text: "text-orange-400",
    accent: "border-orange-800/50",
    preview: "Fast. Loud. Built to move.",
  },
];

const FEATURES = [
  "Contact Form",
  "Booking",
  "Gallery",
  "Google Reviews",
  "Google Map",
  "Blog",
  "Shopify Store",
  "Payments",
  "Customer Portal",
  "AI Chat",
];

const PHOTO_TYPES = [
  "Logo",
  "Headshots",
  "Equipment",
  "Team",
  "Projects",
  "Videos",
];

const inputClass =
  "w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5 block";

type FormData = {
  // Step 1
  business_name: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  service_area: string;
  logo_url: string;
  // Step 2
  goal_why: string;
  goal_success: string;
  goal_challenge: string;
  // Step 3
  design_styles: string[];
  // Step 4
  features: string[];
  custom_features: string;
  // Step 5
  inspiration_love: string;
  inspiration_hate: string;
  competitors: string;
  // Step 6
  photos_notes: string;
  photos_needed: string[];
  // Step 7
  final_note: string;
};

const EMPTY: FormData = {
  business_name: "",
  industry: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  service_area: "",
  logo_url: "",
  goal_why: "",
  goal_success: "",
  goal_challenge: "",
  design_styles: [],
  features: [],
  custom_features: "",
  inspiration_love: "",
  inspiration_hate: "",
  competitors: "",
  photos_notes: "",
  photos_needed: [],
  final_note: "",
};

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export default function IntakeForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function field(key: keyof FormData) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => set(key, e.target.value as FormData[typeof key]);
  }

  function canAdvance(): boolean {
    if (step === 1) {
      return (
        form.business_name.trim() !== "" &&
        form.contact_name.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)
      );
    }
    return true;
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <CGMedallion size={56} className="mx-auto" />
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">
            We&apos;ve got it.
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            Your intake form has been submitted. Jerry will review everything
            and reach out soon to start building.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
          >
            Back to Common Ground →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center gap-4">
        <Link href="/">
          <CGMedallion size={32} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
            Common Ground Workshop
          </p>
          <p className="text-sm text-zinc-400">Client Intake Form</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-zinc-900">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600 mb-2">
          Step {step} of {TOTAL_STEPS}
        </p>

        {/* ── STEP 1: Business Information ── */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Business Information
              </h1>
              <p className="text-zinc-500 text-sm">
                Let&apos;s start with the basics about your business.
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  Business Name <span className="text-amber-500">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Fresh Styles Barbershop"
                  value={form.business_name}
                  onChange={field("business_name")}
                />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Barbershop, Childcare, Construction"
                  value={form.industry}
                  onChange={field("industry")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    Your Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Full name"
                    value={form.contact_name}
                    onChange={field("contact_name")}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Email <span className="text-amber-500">*</span>
                  </label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                    value={form.contact_email}
                    onChange={field("contact_email")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={form.contact_phone}
                    onChange={field("contact_phone")}
                  />
                </div>
                <div>
                  <label className={labelClass}>Service Area</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Salt Lake City, UT"
                    value={form.service_area}
                    onChange={field("service_area")}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Logo URL</label>
                <input
                  className={inputClass}
                  placeholder="Google Drive or Dropbox link to your logo"
                  value={form.logo_url}
                  onChange={field("logo_url")}
                />
                <p className="text-[11px] text-zinc-600 mt-1.5">
                  Paste a shareable link. You can also send it separately — no
                  worries.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Business Goals ── */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Business Goals
              </h1>
              <p className="text-zinc-500 text-sm">
                Help us understand what you&apos;re trying to accomplish.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>
                  Why are you building this website?
                </label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="Tell us what's driving this project..."
                  value={form.goal_why}
                  onChange={field("goal_why")}
                />
              </div>
              <div>
                <label className={labelClass}>
                  What does success look like?
                </label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="e.g. More bookings, clients can find us online, we look professional..."
                  value={form.goal_success}
                  onChange={field("goal_success")}
                />
              </div>
              <div>
                <label className={labelClass}>What&apos;s your biggest challenge right now?</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="e.g. No online presence, losing clients to competitors, hard to get found..."
                  value={form.goal_challenge}
                  onChange={field("goal_challenge")}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Design Style ── */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Design Style
              </h1>
              <p className="text-zinc-500 text-sm">
                Select everything that feels right. You can pick multiple.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DESIGN_STYLES.map((style) => {
                const selected = form.design_styles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() =>
                      set("design_styles", toggleItem(form.design_styles, style.id))
                    }
                    className={`relative rounded-xl border-2 p-4 text-left transition-all duration-150 ${style.bg} ${
                      selected
                        ? "border-amber-500 ring-1 ring-amber-500/30"
                        : `${style.accent} hover:border-zinc-600`
                    }`}
                  >
                    {selected && (
                      <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
                    <p
                      className={`text-sm font-bold mb-1 ${style.text} ${style.bigText ? "text-base" : ""}`}
                    >
                      {style.label}
                    </p>
                    <p
                      className={`text-[10px] leading-snug ${style.text} opacity-60`}
                    >
                      {style.preview}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 4: Features ── */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Features
              </h1>
              <p className="text-zinc-500 text-sm">
                Check everything you need on your site.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((feature) => {
                const selected = form.features.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() =>
                      set("features", toggleItem(form.features, feature))
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                      selected
                        ? "border-amber-500 bg-amber-500/5 text-zinc-50"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        selected
                          ? "bg-amber-500 border-amber-500"
                          : "border-zinc-700"
                      }`}
                    >
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">{feature}</span>
                  </button>
                );
              })}
            </div>
            <div>
              <label className={labelClass}>Custom Features</label>
              <textarea
                className={`${inputClass} min-h-[80px] resize-none`}
                placeholder="Describe any custom features not listed above..."
                value={form.custom_features}
                onChange={field("custom_features")}
              />
            </div>
          </div>
        )}

        {/* ── STEP 5: Inspiration ── */}
        {step === 5 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Inspiration
              </h1>
              <p className="text-zinc-500 text-sm">
                Share websites that influence your vision. URLs, names, or
                anything that helps.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Websites You Love</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="Paste links or describe sites you like and why..."
                  value={form.inspiration_love}
                  onChange={field("inspiration_love")}
                />
              </div>
              <div>
                <label className={labelClass}>Websites You Dislike</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  placeholder="Paste links or describe what you don't want..."
                  value={form.inspiration_hate}
                  onChange={field("inspiration_hate")}
                />
              </div>
              <div>
                <label className={labelClass}>Your Competitors</label>
                <textarea
                  className={`${inputClass} min-h-[80px] resize-none`}
                  placeholder="Who are the main businesses you compete with?"
                  value={form.competitors}
                  onChange={field("competitors")}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 6: Photos ── */}
        {step === 6 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Photos &amp; Media
              </h1>
              <p className="text-zinc-500 text-sm">
                Check what you have available. Share a Google Drive or Dropbox
                link below.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PHOTO_TYPES.map((type) => {
                const selected = form.photos_needed.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      set("photos_needed", toggleItem(form.photos_needed, type))
                    }
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                      selected
                        ? "border-amber-500 bg-amber-500/5 text-zinc-50"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        selected
                          ? "bg-amber-500 border-amber-500"
                          : "border-zinc-700"
                      }`}
                    >
                      {selected && (
                        <svg className="w-2.5 h-2.5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm font-medium">{type}</span>
                  </button>
                );
              })}
            </div>
            <div>
              <label className={labelClass}>Shared Folder Link</label>
              <input
                className={inputClass}
                placeholder="Google Drive or Dropbox link to your media folder"
                value={form.photos_notes}
                onChange={field("photos_notes")}
              />
              <p className="text-[11px] text-zinc-600 mt-1.5">
                Don&apos;t have everything yet? No problem — you can send it later.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 7: Final Notes ── */}
        {step === 7 && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight mb-2">
                Final Notes
              </h1>
              <p className="text-zinc-500 text-sm">
                One last question — this one matters most.
              </p>
            </div>
            <div>
              <label className={labelClass}>
                What should people remember after visiting your website?
              </label>
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                placeholder="Describe the feeling, the impression, the one thing that sticks..."
                value={form.final_note}
                onChange={field("final_note")}
              />
            </div>
            {error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-zinc-900">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Cancel
            </Link>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => {
                if (canAdvance()) {
                  setError("");
                  setStep((s) => s + 1);
                } else {
                  setError(
                    "Please fill in your business name, your name, and a valid email to continue."
                  );
                }
              }}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm px-6 py-3 transition-colors duration-150 flex items-center gap-2"
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 font-semibold text-sm px-6 py-3 transition-colors duration-150 flex items-center gap-2"
            >
              {loading ? "Submitting…" : "Submit Intake"}
              {!loading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </button>
          )}
        </div>

        {step === 1 && error && (
          <p className="text-sm text-red-400 mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
