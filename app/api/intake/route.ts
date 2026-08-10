import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { business_name, contact_name, contact_email } = body;

  if (!business_name?.trim())
    return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  if (!contact_name?.trim())
    return NextResponse.json({ error: "Your name is required" }, { status: 400 });
  if (!contact_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email))
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });

  const supabase = await createClient();
  const { error: dbError } = await supabase.from("intake_submissions").insert({
    business_name: business_name.trim(),
    industry: body.industry?.trim() || null,
    contact_name: contact_name.trim(),
    contact_email: contact_email.trim().toLowerCase(),
    contact_phone: body.contact_phone?.trim() || null,
    service_area: body.service_area?.trim() || null,
    logo_url: body.logo_url?.trim() || null,
    goal_why: body.goal_why?.trim() || null,
    goal_success: body.goal_success?.trim() || null,
    goal_challenge: body.goal_challenge?.trim() || null,
    design_styles: body.design_styles ?? [],
    features: body.features ?? [],
    custom_features: body.custom_features?.trim() || null,
    inspiration_love: body.inspiration_love?.trim() || null,
    inspiration_hate: body.inspiration_hate?.trim() || null,
    competitors: body.competitors?.trim() || null,
    photos_notes: body.photos_notes?.trim() || null,
    photos_needed: body.photos_needed ?? [],
    final_note: body.final_note?.trim() || null,
  });

  if (dbError) {
    console.error("Intake submission error:", dbError);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }

  // Send email notification if Resend key is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const styles = (body.design_styles ?? []).join(", ") || "None selected";
      const features = (body.features ?? []).join(", ") || "None selected";
      const photos = (body.photos_needed ?? []).join(", ") || "None selected";

      await resend.emails.send({
        from: "FLO <noreply@commonground.build>",
        to: "castillojerry801@gmail.com",
        subject: `New Intake: ${business_name.trim()}`,
        html: `
<div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;background:#09090b;color:#f4f4f5;border-radius:12px;overflow:hidden">
  <div style="background:#f59e0b;padding:24px 32px">
    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#09090b">Common Ground Workshop</p>
    <h1 style="margin:8px 0 0;font-size:24px;font-weight:800;color:#09090b">New Client Intake</h1>
  </div>
  <div style="padding:32px">
    <h2 style="margin:0 0 4px;font-size:20px;font-weight:700;color:#f4f4f5">${business_name.trim()}</h2>
    <p style="margin:0 0 24px;color:#a1a1aa;font-size:14px">${body.industry?.trim() || ""}</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#71717a;width:140px">Name</td><td style="color:#f4f4f5">${contact_name.trim()}</td></tr>
      <tr><td style="padding:8px 0;color:#71717a">Email</td><td style="color:#f4f4f5">${contact_email.trim()}</td></tr>
      ${body.contact_phone ? `<tr><td style="padding:8px 0;color:#71717a">Phone</td><td style="color:#f4f4f5">${body.contact_phone}</td></tr>` : ""}
      ${body.service_area ? `<tr><td style="padding:8px 0;color:#71717a">Service Area</td><td style="color:#f4f4f5">${body.service_area}</td></tr>` : ""}
    </table>

    ${body.goal_why ? `<div style="margin-top:24px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Why They're Building</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.goal_why}</p></div>` : ""}
    ${body.goal_success ? `<div style="margin-top:12px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">What Success Looks Like</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.goal_success}</p></div>` : ""}
    ${body.goal_challenge ? `<div style="margin-top:12px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Biggest Challenge</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.goal_challenge}</p></div>` : ""}

    <div style="margin-top:24px;display:flex;flex-wrap:wrap;gap:8px">
      <div style="background:#18181b;border-radius:8px;padding:12px 16px;flex:1;min-width:180px">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Design Styles</p>
        <p style="margin:0;font-size:13px;color:#e4e4e7">${styles}</p>
      </div>
      <div style="background:#18181b;border-radius:8px;padding:12px 16px;flex:1;min-width:180px">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Features Needed</p>
        <p style="margin:0;font-size:13px;color:#e4e4e7">${features}</p>
      </div>
    </div>

    ${body.custom_features ? `<div style="margin-top:12px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Custom Features</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.custom_features}</p></div>` : ""}

    ${body.inspiration_love ? `<div style="margin-top:24px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Sites They Love</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.inspiration_love}</p></div>` : ""}
    ${body.inspiration_hate ? `<div style="margin-top:12px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Sites They Dislike</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.inspiration_hate}</p></div>` : ""}
    ${body.competitors ? `<div style="margin-top:12px;background:#18181b;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Competitors</p><p style="margin:0;font-size:14px;color:#e4e4e7;line-height:1.6">${body.competitors}</p></div>` : ""}

    <div style="margin-top:12px;background:#18181b;border-radius:8px;padding:12px 16px">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a">Media Available</p>
      <p style="margin:0;font-size:13px;color:#e4e4e7">${photos}</p>
      ${body.photos_notes ? `<p style="margin:8px 0 0;font-size:13px;color:#a1a1aa">${body.photos_notes}</p>` : ""}
    </div>

    ${body.final_note ? `<div style="margin-top:24px;background:#1c1400;border:1px solid #78350f;border-radius:8px;padding:16px"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f59e0b">What They Want People to Remember</p><p style="margin:0;font-size:15px;color:#fef3c7;line-height:1.7;font-style:italic">"${body.final_note}"</p></div>` : ""}

    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #27272a;text-align:center">
      <a href="https://commonground.build/flo/intakes" style="display:inline-block;background:#f59e0b;color:#09090b;font-weight:700;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none">View in FLO →</a>
    </div>
  </div>
</div>`,
      });
    } catch (emailErr) {
      // Email failure doesn't fail the submission
      console.error("Email send error:", emailErr);
    }
  }

  return NextResponse.json({ success: true });
}
