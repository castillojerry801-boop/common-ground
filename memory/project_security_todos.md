---
name: security-todos
description: Known security issues to fix — unprotected API routes and missing headers
metadata:
  type: project
---

Three API routes need auth checks added before next session. All fixes are small (a few lines each).

**Why:** Full security review on 2026-07-19 found these routes are open to the public internet with no authentication.

**How to apply:** When Jerry says "let's work on security" or "fix the API routes," start here.

## To fix

### HIGH — FLO routes have no auth (real financial risk)
- `app/api/flo/chat/route.ts` — anyone can call FLO, burn OpenAI credits, and use FLO tools to delete inquiries or modify the projects database
- `app/api/flo/speak/route.ts` — anyone can call the TTS endpoint and burn OpenAI TTS credits
- Fix: add `supabase.auth.getUser()` check at the top of each POST handler; return 401 if no user

### MEDIUM — Contact DELETE has no auth
- `app/api/contact/[id]/route.ts` — anyone who knows a UUID can delete a contact submission
- Fix: same auth check pattern — supabase client is already created in that handler

### LOW — No security headers
- `next.config.ts` is empty — missing `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
- Fix: add `headers()` config in next.config.ts

### LOW — No rate limiting on contact form POST
- `app/api/contact/route.ts` — no protection against spam submissions
- Fix: middleware-based IP rate limiting or Supabase RLS policy
