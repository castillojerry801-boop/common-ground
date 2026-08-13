"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const INDUSTRIES = [
  "Attorney", "Barber / Barbershop", "Childcare", "Cleaning Service",
  "Construction", "Contractor", "Dentist", "Electrician",
  "Excavation", "Flooring", "Gym / Fitness", "HVAC",
  "Landscaping", "Mechanic", "Nonprofit", "Painter",
  "Pest Control", "Photographer", "Plumber", "Restaurant",
  "Roofing", "Salon / Beauty", "Tattoo Studio", "Veterinarian", "Other",
];

const inputClass = "w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-zinc-50 placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors duration-150";
const labelClass = "text-xs font-medium uppercase tracking-[0.15em] text-zinc-500 mb-1.5 block";

type Toggle = { label: string; key: string; trueLabel: string; falseLabel: string };

const TOGGLES: Toggle[] = [
  { label: "Has Website", key: "has_website", trueLabel: "Yes", falseLabel: "No" },
  { label: "SSL (HTTPS)", key: "website_has_ssl", trueLabel: "Yes", falseLabel: "No" },
  { label: "Mobile Friendly", key: "website_mobile_friendly", trueLabel: "Yes", falseLabel: "No" },
  { label: "Facebook Only", key: "facebook_only", trueLabel: "Yes", falseLabel: "No" },
];

export default function NewLeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    industry: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    website: "",
    google_rating: "",
    google_review_count: "",
    google_maps_url: "",
    facebook_url: "",
    notes: "",
    has_website: false,
    website_has_ssl: false,
    website_mobile_friendly: false,
    facebook_only: false,
    source: "manual",
  });

  function setField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/flo/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          google_rating: form.google_rating ? parseFloat(form.google_rating) : null,
          google_review_count: form.google_review_count ? parseInt(form.google_review_count) : null,
          website_has_ssl: form.has_website ? form.website_has_ssl : null,
          website_mobile_friendly: form.has_website ? form.website_mobile_friendly : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to save lead.");
        return;
      }
      router.push(`/flo/leadflo/${data.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="border-b border-zinc-900 px-6 py-5 flex items-center gap-3">
        <Link href="/flo/leadflo" className="text-zinc-600 hover:text-zinc-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500">LeadFlo</p>
          <h1 className="text-lg font-bold text-zinc-50 leading-none">Add New Lead</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Business Info */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Business Information</p>
          <div>
            <label className={labelClass}>Business Name <span className="text-amber-500">*</span></label>
            <input className={inputClass} placeholder="e.g. Smith Roofing" value={form.business_name} onChange={(e) => setField("business_name", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Industry</label>
              <select className={`${inputClass} text-zinc-300`} value={form.industry} onChange={(e) => setField("industry", e.target.value)}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Owner Name</label>
              <input className={inputClass} placeholder="Full name" value={form.owner_name} onChange={(e) => setField("owner_name", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} type="tel" placeholder="(555) 000-0000" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} type="email" placeholder="owner@business.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input className={inputClass} placeholder="Street address" value={form.address} onChange={(e) => setField("address", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>City</label>
              <input className={inputClass} placeholder="City" value={form.city} onChange={(e) => setField("city", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input className={inputClass} placeholder="UT" maxLength={2} value={form.state} onChange={(e) => setField("state", e.target.value.toUpperCase())} />
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Website & Online Presence</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TOGGLES.map(({ label, key, trueLabel, falseLabel }) => {
              const val = form[key as keyof typeof form] as boolean;
              const disabled = !form.has_website && key !== "has_website" && key !== "facebook_only";
              return (
                <div key={key} className={`rounded-xl border p-3 ${disabled ? "opacity-40" : ""}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 mb-2">{label}</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setField(key, true)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${val ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-600 border border-zinc-700"}`}
                    >
                      {trueLabel}
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setField(key, false)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${!val ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-zinc-800 text-zinc-600 border border-zinc-700"}`}
                    >
                      {falseLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {form.has_website && (
            <div>
              <label className={labelClass}>Website URL</label>
              <input className={inputClass} placeholder="https://example.com" value={form.website} onChange={(e) => setField("website", e.target.value)} />
            </div>
          )}
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input className={inputClass} placeholder="https://facebook.com/business" value={form.facebook_url} onChange={(e) => setField("facebook_url", e.target.value)} />
          </div>
        </div>

        {/* Google */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Google Business</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Google Rating</label>
              <input className={inputClass} type="number" step="0.1" min="1" max="5" placeholder="4.8" value={form.google_rating} onChange={(e) => setField("google_rating", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Review Count</label>
              <input className={inputClass} type="number" min="0" placeholder="124" value={form.google_review_count} onChange={(e) => setField("google_review_count", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Google Maps URL</label>
            <input className={inputClass} placeholder="https://maps.google.com/..." value={form.google_maps_url} onChange={(e) => setField("google_maps_url", e.target.value)} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">Notes</p>
          <textarea
            className={`${inputClass} min-h-[80px] resize-none`}
            placeholder="Any notes about this lead…"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
          <Link href="/flo/leadflo" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Cancel</Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-zinc-950 font-semibold text-sm px-6 py-3 transition-colors flex items-center gap-2"
          >
            {loading ? "Saving…" : "Save Lead"}
            {!loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
