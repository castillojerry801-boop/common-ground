"use client";

import { useState } from "react";
import { CGLogoStacked } from "@/app/components/ui/CGMark";
import Link from "next/link";

const BUSINESS_TYPES = [
  { value: "salon_spa", label: "Salon / Spa" },
  { value: "youth_sports", label: "Youth Sports Organization" },
  { value: "other", label: "Other" },
];

const inputClass =
  "w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.15em] text-zinc-500";

export default function ContactForm() {
  const [fields, setFields] = useState({
    full_name: "",
    business_name: "",
    email: "",
    phone: "",
    business_type: "",
    looking_for: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-10">
            <CGLogoStacked size={64} markColor="white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 mb-4">
            We got it.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed mb-10">
            Thanks for reaching out. We&apos;ll review your information and get
            back to you shortly.
          </p>
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors duration-150"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-20">
      <div className="mx-auto w-full max-w-lg">
        <div className="flex justify-center mb-12">
          <Link href="/">
            <CGLogoStacked size={64} markColor="white" />
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 leading-tight mb-3">
            Let&apos;s talk.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Tell us about your business and what you&apos;re looking for. We&apos;ll
            reach out personally.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name + Business */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="full_name" className={labelClass}>Full Name</label>
              <input
                id="full_name"
                type="text"
                required
                placeholder="Jane Smith"
                value={fields.full_name}
                onChange={set("full_name")}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="business_name" className={labelClass}>Business Name</label>
              <input
                id="business_name"
                type="text"
                required
                placeholder="Elevated Beauty"
                value={fields.business_name}
                onChange={set("business_name")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@yourbusiness.com"
                value={fields.email}
                onChange={set("email")}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className={labelClass}>
                Phone <span className="text-zinc-700 normal-case tracking-normal">optional</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="(801) 555-0100"
                value={fields.phone}
                onChange={set("phone")}
                className={inputClass}
              />
            </div>
          </div>

          {/* Business type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="business_type" className={labelClass}>Type of Business</label>
            <select
              id="business_type"
              required
              value={fields.business_type}
              onChange={set("business_type")}
              className={`${inputClass} appearance-none`}
            >
              <option value="" disabled>Select one…</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* What are you looking for — textarea */}
          <div className="flex flex-col gap-2">
            <label htmlFor="looking_for" className={labelClass}>What are you looking for?</label>
            <textarea
              id="looking_for"
              required
              rows={6}
              placeholder="Describe what you need, the problems you're running into, or what you'd love to have in a software tool…"
              value={fields.looking_for}
              onChange={set("looking_for")}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Anything else — textarea */}
          <div className="flex flex-col gap-2">
            <label htmlFor="notes" className={labelClass}>
              Anything else? <span className="text-zinc-700 normal-case tracking-normal">optional</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Timeline, budget, team size, questions — whatever else is on your mind."
              value={fields.notes}
              onChange={set("notes")}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-sm font-semibold transition-colors duration-150 disabled:opacity-40"
          >
            {loading ? "Sending…" : "Send My Info"}
          </button>

          <p className="text-center text-xs text-zinc-700">
            Access is by invitation only. This form is for prospective clients.
          </p>
        </form>
      </div>
    </div>
  );
}
