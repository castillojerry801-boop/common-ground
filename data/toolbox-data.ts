export type ToolboxTemplate = {
  id: string;
  name: string;
  description: string;
  category: "website-build" | "module";
  tags: string[];
  prompt: string;
};

export const toolboxTemplates: ToolboxTemplate[] = [
  // ─────────────────────────────────────────────────────────────
  // WEBSITE BUILD TEMPLATES
  // ─────────────────────────────────────────────────────────────
  {
    id: "local-service",
    name: "Local Service Business",
    description: "Contractors, cleaners, home services, landscapers, barbers — any local business where the service comes to you or you go to them.",
    category: "website-build",
    tags: ["local", "service", "contractor", "cleaning", "barber", "home service"],
    prompt: `Build a complete local service business website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a trust-first, conversion-focused local business site. Visitors should immediately know what you do, where you serve, and how to contact you or request a quote.

## Business Info (fill in before starting)

\`\`\`
Business Name:
Service Type: (e.g. "residential cleaning", "landscaping", "electrical", "barber")
Service Area / City:
Phone:
Email:
Primary CTA: (e.g. "Get a Free Quote", "Book Now", "Call Us Today")
License / Insurance: (yes/no — if yes, display prominently)
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: business name, tagline, service area, phone, email, services array (name, description, icon), testimonials array, FAQ array, social links, license info.

## Required Sections
1. **Navbar** — Sticky. Logo left. Phone number center. Primary CTA right. Always visible on mobile.
2. **Hero** — Service type, area served, trust signals (licensed/insured), two CTAs: primary (quote/book) and secondary (learn more). Photo with overlay.
3. **Trust Strip** — 3–4 quick trust signals: Licensed & Insured, Years in Business, Rating, Response Time.
4. **Services** — Grid of service cards. Icon, name, short description. Pulled from \`site.ts\`.
5. **Why Choose Us** — 3–4 differentiators. Icon + headline + short description.
6. **Testimonials** — 3–5 customer reviews. Name, location, rating, text.
7. **Service Area** — Map placeholder or list of cities/neighborhoods served.
8. **Quote / Contact CTA** — Full-width section. Inline form: name, phone, email, service needed, message. POST to \`/api/contact\`.
9. **FAQ** — 4–6 questions. Accordion or stacked.
10. **Footer** — Phone, email, address, service area, social links, license number, copyright.

## Sticky Mobile CTA
Add a sticky bottom bar on mobile only with: phone number (tap to call) + "Get a Quote" button. Hidden on desktop.

## SEO
Title: \`[Business Name] — [Service Type] in [City]\`

## Tone
Direct, trustworthy, local. Homeowners need to feel safe letting this person into their space. Specific beats generic. "Serving the Salt Lake Valley since 2018" is better than "years of experience."

## Placeholders
\`[BUSINESS NAME]\`, \`[SERVICE TYPE]\`, \`[CITY]\`, \`[PHONE]\`, \`[EMAIL]\`, \`[LICENSE NUMBER]\``,
  },
  {
    id: "booking-business",
    name: "Booking Business",
    description: "Salons, spas, barbers, trainers, coaches, wellness providers — any business where the main goal is getting clients to book an appointment.",
    category: "website-build",
    tags: ["booking", "salon", "spa", "barber", "trainer", "coach", "wellness", "appointment"],
    prompt: `Build a complete appointment-based business website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a booking-conversion site — not a generic brochure. Every section should help the visitor understand the services, trust the provider, and book an appointment.

## Business Info (fill in before starting)

\`\`\`
Business Name:
Service Type: (salon, barber, trainer, spa, massage, wellness, etc.)
Location / Address:
Phone:
Email:
Booking Platform / Link: (Square, Vagaro, Booksy, Calendly, or TBD)
Primary CTA: (e.g. "Book Now", "Schedule Appointment", "Reserve Your Spot")
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: business name, tagline, location, phone, email, booking link, services array (category, name, description, duration, price), providers array (name, title, bio, specialties), testimonials array, FAQ array, policies object (cancellation, deposit, late arrival, no-show), booking steps array.

## Required Sections
1. **Navbar** — Sticky. Logo left. "Book Now" always visible right, even on mobile.
2. **Hero** — Strong headline. Location and service type. Large "Book Now" CTA. Secondary "See Services" link.
3. **Service Categories** — Grid or horizontal scroll. Category name, icon, short description. Links to full services.
4. **Featured Services** — 3–6 services. Name, duration, price placeholder, booking CTA.
5. **Providers / Team** — Profile cards. Name, title, bio, specialties, photo placeholder, "Book with [Name]" button.
6. **How Booking Works** — 3 steps: Choose → Schedule → Confirmed. Clean, numbered, horizontal on desktop.
7. **Booking CTA Section** — Full-width. Strong background. Large "Book Now" button.
8. **Policies** — Cancellation, deposit, late arrival, no-show. Short and clear.
9. **Testimonials** — 3–5 reviews. Name, service received, rating, text.
10. **FAQ** — 4–6 questions about booking and services.
11. **Contact / Location / Footer** — Phone, email, address, hours, social, copyright.

## Booking Button Behavior
- Opens external booking link in new tab (from \`site.ts\`)
- OR scrolls to contact form if no platform set
- Mark as \`[BOOKING_LINK]\` if not yet provided

## SEO
Title: \`[Business Name] — [Service Type] in [City]\`

## Tone
Polished, confident, welcoming. Professional without being cold. Premium without being intimidating.

## Placeholders
\`[BUSINESS NAME]\`, \`[CITY]\`, \`[PHONE]\`, \`[EMAIL]\`, \`[BOOKING_LINK]\`, \`[PROVIDER NAME]\`, \`[SERVICE PRICE]\``,
  },
  {
    id: "sports-organization",
    name: "Sports Organization",
    description: "Basketball programs, soccer clubs, leagues, tournaments, camps, clinics, trainers, and youth sports organizations.",
    category: "website-build",
    tags: ["sports", "basketball", "soccer", "camp", "clinic", "league", "youth", "tournament"],
    prompt: `Build a complete sports organization website using Next.js App Router, TypeScript, and Tailwind CSS.

This is an action-focused sports hub — not a generic brochure. Parents, athletes, coaches, and sponsors should be able to find what they need immediately and take action fast.

## Organization Info (fill in before starting)

\`\`\`
Organization Name:
Sport(s):
Age Groups Served:
Location / City:
Phone:
Email:
Registration Link: (external platform or TBD)
Schedule Link: (external platform or TBD)
Donation / Sponsor Link: (optional)
Primary CTA: (e.g. "Register Now", "Join the Program", "Sign Up Today")
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: org name, sport, mission statement, location, phone, email, programs array (name, description, age group, season, registration link), events array (name, date, time, location, description, link), stats array (number, label), FAQ array, sponsors array (name, tier), quick actions array (label, description, link, icon).

## Required Sections
1. **Navbar** — Sticky. Logo left. "Register Now" always visible right. Hamburger on mobile.
2. **Hero** — Org name, sport, mission tagline, two CTAs. Strong dark overlay or bold color. Energy — not flat.
3. **Quick Actions Strip** — 3–4 action buttons below hero: Register, Schedule, Donate, Contact. Icon + label + description.
4. **Programs** — Grid of program cards. Name, age group, season/dates, description, registration CTA. "Registration Open" or "Coming Soon" badge.
5. **Upcoming Events** — 3–6 event cards in chronological order. Name, date, time, location, description.
6. **Athlete / Parent Info** — What to expect, how to get started, what's included. Icon list. Reassuring tone.
7. **Impact / Stats** — Full-width. 3–4 key numbers: athletes served, seasons, teams, years.
8. **Sponsor / Donation CTA** — Sponsor tiers, donation link, logo display. Skip if not applicable.
9. **Photo / Media Gallery** — 4–6 image placeholder slots. Clearly marked \`[INSERT PHOTOS HERE]\`.
10. **FAQ** — 4–6 questions from parents and athletes.
11. **Contact / Footer** — Phone, email, location, social links, copyright.

## SEO
Title: \`[Organization Name] — [Sport] Programs in [City]\`

## Tone
Energetic, community-driven, trustworthy. Parents need to feel confident. Athletes need to feel motivated. The site should feel like the team behind it takes the sport — and the kids — seriously.

## Placeholders
\`[ORGANIZATION NAME]\`, \`[SPORT]\`, \`[CITY]\`, \`[PHONE]\`, \`[EMAIL]\`, \`[REGISTRATION LINK]\`, \`[INSERT PHOTOS HERE]\``,
  },
  {
    id: "restaurant-bar",
    name: "Restaurant / Bar / Catering",
    description: "Restaurants, bars, cafes, food trucks, catering companies, and local food businesses.",
    category: "website-build",
    tags: ["restaurant", "bar", "catering", "cafe", "food truck", "food", "menu"],
    prompt: `Build a complete restaurant, bar, or food service website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a customer-facing food and hospitality site — not a generic brochure. Visitors should be able to see the menu, make catering inquiries, find the location and hours, and feel the atmosphere of the place before they ever walk in the door.

## Business Info (fill in before starting)

\`\`\`
Business Name:
Type: (restaurant, bar, cafe, food truck, catering, event venue, etc.)
Cuisine / Concept: (e.g. "Mexican street food", "craft cocktail bar", "BBQ catering")
Location / Address:
Phone:
Email:
Hours: (list by day)
Reservation Link: (OpenTable, Resy, Yelp, or TBD)
Catering Email or Form: (or TBD)
Primary CTA: (e.g. "View Menu", "Book a Table", "Order Online", "Get a Catering Quote")
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: business name, type, tagline, location, phone, email, hours, menu array (categories with items: name, description, price), events array (title, date, description), testimonials array, catering details object (description, min guests, contact), gallery slots array, quick info array.

## Required Sections
1. **Navbar** — Sticky. Logo left. Primary CTA right ("View Menu", "Book a Table"). Hamburger on mobile.
2. **Hero** — Business name, concept tagline, two CTAs, location and hours below CTAs. Full-bleed image with dark overlay. Strong vibe.
3. **Feature Strip** — 3–4 quick-info tiles: Location, Hours, Catering Available, Private Events. Icon + label + value.
4. **Menu Preview** — Category tabs or stacked sections. Items with name, description, price placeholder. "See Full Menu" CTA at bottom.
5. **Catering / Private Events** — Headline, description, key details. Catering inquiry form or email CTA. Form: name, phone, email, event date, guest count, event type, notes.
6. **Specials / Events** — Cards for upcoming or recurring events. Name, date/day, description, image placeholder.
7. **Photo Gallery** — 6–8 image placeholder slots. Grid or masonry. Clearly marked \`[INSERT PHOTO HERE]\`.
8. **Reviews / Testimonials** — 3–5 reviews. Name, platform, rating, text.
9. **Location / Hours / Contact** — Address, map placeholder, hours by day, phone, email.
10. **Footer** — Business name, quick links, social icons, hours summary, copyright.

## Catering Form
POST to \`/api/catering\`. Fields: name, phone, email, event date, guest count, event type, notes. Insert to Supabase \`catering_inquiries\` (or stub with TODO).

## SEO
Title: \`[Business Name] — [Cuisine/Type] in [City]\`

## Tone
Warm, inviting, local. Not corporate. Not generic. Like the place actually has a personality.

## Placeholders
\`[BUSINESS NAME]\`, \`[CUISINE]\`, \`[CITY]\`, \`[PHONE]\`, \`[EMAIL]\`, \`[HOURS]\`, \`[PRICE]\`, \`[INSERT PHOTO HERE]\``,
  },
  {
    id: "nonprofit-donation",
    name: "Nonprofit / Donation",
    description: "Nonprofits, charities, scholarship programs, community organizations, foundations, and mission-driven projects.",
    category: "website-build",
    tags: ["nonprofit", "donation", "charity", "foundation", "scholarship", "community", "501c3"],
    prompt: `Build a complete nonprofit and donation website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a trust-first, mission-focused site. Visitors should immediately understand who is being helped, why it matters, and exactly where their donation goes. Every section should move a potential donor from awareness to action.

## Organization Info (fill in before starting)

\`\`\`
Organization Name:
Mission Statement: (one sentence)
Who You Serve: (e.g. "youth athletes in underserved communities")
Location / Region:
Phone:
Email:
EIN / Tax ID: (for "tax-deductible donation" language)
501(c)(3) Status: (yes/no — if pending, do not claim it)
Donation Platform: (Stripe, Square, Donorbox, PayPal Giving Fund, or TBD)
Donation Link: (external link or TBD)
Sponsor Inquiry Email:
Primary CTA: (e.g. "Donate Now", "Give Today", "Support the Mission")
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: org name, mission, who they serve, location, phone, email, EIN, impact stats array (number, label), spending breakdown array (category, percentage, description), programs array (name, description, who it serves), events array (name, date, location, description, link), sponsors array (name, tier), FAQ array, donation tiers array (amount, label, impact description).

## Required Sections
1. **Navbar** — Sticky. Logo left. "Donate Now" always visible right — never hidden.
2. **Hero** — Org name, one-sentence mission, who is served (specific and human), large "Donate Now" CTA. Hopeful, urgent, specific.
3. **Impact Numbers** — Full-width. 3–4 bold stats: youth served, dollars raised, years active, programs. Mark as \`[STAT]\` if not yet provided.
4. **Where Donations Go** — Spending transparency. 3–4 categories with percentages. Progress bars or card grid. "Every dollar is tracked. Here's where yours goes."
5. **Programs / Initiatives** — Grid of program cards. Name, who it serves, description, image placeholder.
6. **Mission / Story** — 2-column: text + image placeholder. Founder or key figure. Why it started. Pull quote.
7. **Donation CTA Section** — Full-width strong background. Donation tier cards (optional). Large "Donate Now" button. EIN and tax-deductible note.
8. **Sponsors / Partners** — Sponsor logo grid by tier. "Become a Sponsor" CTA.
9. **Events / Fundraisers** — 2–4 upcoming event cards.
10. **FAQ** — 4–6 donor questions: tax-deductibility, volunteering, where money goes.
11. **Contact / Footer** — Phone, email, address, social links, EIN, tax-deductible statement, copyright.

## Legal Notes
- Only use "tax-deductible" language if 501(c)(3) is confirmed
- Always display EIN in footer if confirmed
- Use \`[501(c)(3) PENDING]\` if status not yet confirmed

## SEO
Title: \`[Organization Name] — [Mission Summary] in [City/Region]\`

## Tone
Hopeful, human, and clear. Be specific about who is served, what is done, and what the money funds. Donors trust specifics over slogans.

## Placeholders
\`[ORGANIZATION NAME]\`, \`[MISSION STATEMENT]\`, \`[WHO YOU SERVE]\`, \`[CITY]\`, \`[EIN]\`, \`[DONATION_LINK]\`, \`[STAT]\``,
  },
  {
    id: "saas-software",
    name: "SaaS / Software Product",
    description: "Software products, apps, dashboards, booking systems, internal tools, client portals, and SaaS platforms.",
    category: "website-build",
    tags: ["saas", "software", "app", "product", "platform", "dashboard", "tool", "startup"],
    prompt: `Build a complete SaaS or software product landing page using Next.js App Router, TypeScript, and Tailwind CSS.

This is a product-first conversion site. Every section should help the visitor understand the problem, see how the product solves it, and take one clear action: sign up, request a demo, or log in.

## Product Info (fill in before starting)

\`\`\`
Product Name:
Tagline: (one sentence — what it does and for whom)
Target User: (e.g. "small business owners", "coaches", "restaurant managers")
Problem It Solves: (one sentence)
Primary CTA: (e.g. "Start Free Trial", "Request a Demo", "Get Early Access")
Secondary CTA: (e.g. "See How It Works", "View Pricing", "Log In")
Login Link: (or TBD)
Signup / Demo Link: (or TBD)
Pricing Model: (free trial, freemium, paid plans, contact for pricing)
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: product name, tagline, target user, problem statement, CTAs, login/signup links, features array (icon, title, description), use cases array (title, who it's for, description), how-it-works steps array (number, title, description), pricing tiers array (name, price, billing, features list, CTA, highlighted flag), FAQ array, social proof array (metric, label), testimonials array (name, role/company, text).

## Required Sections
1. **Navbar** — Sticky. Logo left. Login link (low-key). Primary CTA right. Hamburger on mobile with both inside.
2. **Hero** — Product name, tagline, 1-paragraph description, two CTAs, social proof line, dashboard mockup placeholder (\`[PRODUCT SCREENSHOT / MOCKUP]\`).
3. **Social Proof Strip** — 3–4 metrics: users, rating, time saved. Bold number + label.
4. **Problem Section** — 2–3 pain point callouts for the target user. Contrasting background. Reads their mind before pitching.
5. **Solution / Features** — 3–6 feature cards. Icon placeholder, title, 2-sentence outcome-focused description.
6. **Product Preview / Mockup** — Larger screenshot placeholder. Callout annotations. Clearly labeled \`[INSERT PRODUCT SCREENSHOT]\`.
7. **Use Cases** — 3–4 cards. Who uses it and how. Helps prospects self-identify.
8. **How It Works** — 3–4 steps. Number, title, description. Horizontal desktop, stacked mobile.
9. **Pricing** — 2–3 tier cards. Name, price, billing, features list, CTA. One highlighted.
10. **Testimonials** — 2–4 customer quotes.
11. **FAQ** — 4–6 questions about the product, pricing, and getting started.
12. **Final CTA Section** — Full-width. Restate core promise. Large CTA. Login or contact link secondary.
13. **Footer** — Product name, nav links, social, login/signup links, copyright.

## Dashboard Mockup Placeholder
Use a styled div: \`[PRODUCT SCREENSHOT / MOCKUP]\`. Add comment: \`// Replace with actual product screenshot or <Image> component\`. Size at 16:9 or 4:3 aspect ratio.

## SEO
Title: \`[Product Name] — [Tagline]\`

## Tone
Clear, confident, direct. No buzzwords. No "revolutionary platform" language. Say what the product does, who it's for, and what happens after they sign up.

## Placeholders
\`[PRODUCT NAME]\`, \`[TAGLINE]\`, \`[TARGET USER]\`, \`[PRICE]\`, \`[SIGNUP_LINK]\`, \`[LOGIN_LINK]\`, \`[PRODUCT SCREENSHOT / MOCKUP]\``,
  },
  {
    id: "personal-brand-coach",
    name: "Personal Brand / Coach",
    description: "Trainers, coaches, consultants, creators, speakers, mentors — any personal service provider where the person is the brand.",
    category: "website-build",
    tags: ["coach", "trainer", "consultant", "personal brand", "mentor", "speaker", "creator"],
    prompt: `Build a complete personal brand and coaching website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a trust-first, person-centered site. The person IS the product. Visitors should immediately understand who this person helps, what they offer, why they are credible, and exactly how to take the next step.

## Person / Brand Info (fill in before starting)

\`\`\`
Full Name:
Title / Role: (e.g. "Business Coach", "Fitness Trainer", "Leadership Consultant")
Who You Help: (e.g. "first-time entrepreneurs", "athletes 16–24", "women in leadership")
Core Promise: (one sentence — the result or transformation you create)
Booking / Inquiry Link: (Calendly, Acuity, contact form, or TBD)
Primary CTA: (e.g. "Book a Free Call", "Apply to Work With Me", "Inquire Now")
Email:
Phone: (optional)
Social Handles: (Instagram, LinkedIn, YouTube, TikTok — list which apply)
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: name, title, tagline, who they help, core promise, CTA label and link, credentials array (title, description), offers array (name, description, who it's for, format, CTA), results array (metric or headline, description), testimonials array (name, role/context, text, photo placeholder), FAQ array, social links object, content appearances array (platform, title, link).

## Required Sections
1. **Navbar** — Sticky. Name or logo left. Primary CTA right. Always visible.
2. **Hero** — Full name. "I help [audience] [achieve result]." Core promise. Primary CTA. Headshot placeholder \`[INSERT HEADSHOT / HERO PHOTO]\`. 2-column: text left, photo right.
3. **Credibility Strip** — 3–5 tiles: years experience, clients served, certifications, media, awards.
4. **About / Story** — Narrative, not a resume. Why they do this. The turning point. Who they help and why they're uniquely positioned. Photo placeholder. Pull quote.
5. **Services / Offers** — 2–4 offer cards. Name, who it's for, format, description, CTA. "Most Popular" badge on featured offer.
6. **Results / Transformation** — 3–4 outcome proof points. Specific results clients achieve. Before/after or result card layout.
7. **Testimonials** — 3–5 client quotes. Name, context, photo placeholder, text.
8. **Booking / Consultation CTA** — Full-width. "Ready to [promise]?" headline. What happens when they click. Large CTA.
9. **Content / Social Proof** — Podcasts, press, YouTube. "As Seen On" or "Featured In." Skip if none.
10. **FAQ** — 4–6 questions about working with this person.
11. **Contact / Footer** — Email, booking link, social links, tagline, copyright.

## Inquiry Form (optional)
Fields: name, email, phone, offer interest (select), message. POST to \`/api/inquiry\`. Insert to Supabase \`coaching_inquiries\`.

## SEO
Title: \`[Full Name] — [Title] for [Who You Help]\`

## Tone
Confident, real, and direct. The site should reflect that this person has done the work — not through hype, but through specificity, story, and evidence.

## Placeholders
\`[FULL NAME]\`, \`[TITLE]\`, \`[WHO YOU HELP]\`, \`[CORE PROMISE]\`, \`[BOOKING_LINK]\`, \`[INSERT HEADSHOT / HERO PHOTO]\`, \`[CLIENT PHOTO]\``,
  },
  {
    id: "event-camp-clinic",
    name: "Event / Camp / Clinic",
    description: "One-page sites for sports camps, clinics, fundraisers, tryouts, tournaments, workshops, and registration-based events.",
    category: "website-build",
    tags: ["event", "camp", "clinic", "fundraiser", "tryout", "tournament", "workshop", "registration"],
    prompt: `Build a complete one-page event, camp, or clinic website using Next.js App Router, TypeScript, and Tailwind CSS.

This is a registration-focused conversion page. Visitors arrive, understand the event immediately, and decide whether to register, donate, or sponsor. Everything on the page serves that decision.

## Event Info (fill in before starting)

\`\`\`
Event Name:
Event Type: (camp, clinic, tournament, tryout, fundraiser, workshop, golf event, etc.)
Who It's For: (e.g. "youth athletes ages 10–16", "local businesses", "high school coaches")
Date(s):
Time:
Location / Venue:
Address:
Cost / Registration Fee: (or "Free" or "Donation-based")
Spots Available: (or TBD)
Registration Link: (external platform or TBD)
Sponsor / Donation Link: (or TBD)
Primary CTA: (e.g. "Register Now", "Reserve Your Spot", "Get Your Ticket")
Contact Email:
Contact Phone:
\`\`\`

## Tech Stack
- Next.js App Router, TypeScript, Tailwind CSS
- All content in \`data/site.ts\`
- Components in \`app/components/sections/\` and \`app/components/ui/\`

## Site Config File
Create \`data/site.ts\` exporting: event name, type, tagline, who it's for, date, time, location, address, cost, registration link, CTA label, quick info array (icon, label, value), agenda array (time, session title, description), whatsIncluded array (item, description), sponsors array (name, tier), FAQ array, contact object (email, phone, social).

## Required Sections
1. **Navbar** — Minimal. Event name or logo left. "Register Now" right. Sticky. Full-width CTA on mobile.
2. **Hero** — Event name, type, tagline, date/time/location visible immediately, who it's for, large CTA. Bold photo with dark overlay or strong brand color.
3. **Quick Info Cards** — 4–5 info cards: Date, Time, Location, Cost, Who It's For. Icon + label + value. Answers every logistics question immediately.
4. **Event Details** — What the event IS in plain language. Who runs it, what the experience looks like. 2–3 paragraphs or bullet list. Photo placeholder.
5. **Schedule / Agenda** — Full agenda. Time + session title + optional description. Timeline or table layout. Mark as \`[SCHEDULE TBD]\` if not finalized.
6. **What's Included** — Everything registrants get. Icon + item + description. Justifies the cost, reduces hesitation.
7. **Registration CTA Section** — Full-width high-contrast. Urgency headline. Fee and deadline. Large CTA. Contact info for questions.
8. **Sponsors / Donors** — Sponsor logo grid by tier. "Become a Sponsor" CTA. Donation CTA if fundraising. Skip if not applicable.
9. **FAQ** — 4–6 logistical questions: what to bring, refund policy, age groups, parking.
10. **Contact / Footer** — Email, phone, social, address (repeated), org name, copyright.

## Registration Button Behavior
- Links to external platform in new tab (SportsEngine, Eventbrite, Google Form, etc.)
- Mark as \`[REGISTRATION_LINK]\` if not yet provided
- Must appear in navbar, hero, AND registration CTA section — minimum three times

## Countdown Timer (optional)
Create client component \`ui/Countdown.tsx\` using \`useEffect\` and \`useState\`. Pull event date from \`site.ts\`. Auto-hides after date passes.

## SEO
Title: \`[Event Name] — [Date] in [City]\`

## Tone
Clear, direct, and energizing. Every word either informs or motivates. Speak to the parent making the decision for a youth event. The faster they can decide, the better.

## Placeholders
\`[EVENT NAME]\`, \`[DATE]\`, \`[TIME]\`, \`[LOCATION]\`, \`[COST]\`, \`[WHO IT'S FOR]\`, \`[REGISTRATION_LINK]\`, \`[SCHEDULE TBD]\``,
  },

  // ─────────────────────────────────────────────────────────────
  // MODULES
  // ─────────────────────────────────────────────────────────────
  {
    id: "generic-scheduler",
    name: "Generic Scheduling Module",
    description: "Drop-in scheduling module for any website. Configurable for barber shops, salons, trainers, court rentals, camps, clinics, or consultations.",
    category: "module",
    tags: ["scheduler", "booking", "appointments", "calendar", "time slots", "module"],
    prompt: `Add a fully customizable scheduling module to this existing Next.js website.

Default to **Request Mode** unless I specifically ask for Instant Booking Mode.

## Modes

**Mode 1 — Request Mode (default)**
Customer selects service, provider (if applicable), date, time, and submits info. Booking stored as \`status: "pending"\`. Admin confirms manually. Best for early-stage sites.

**Mode 2 — Instant Booking Mode**
Real-time availability check. Customer books directly. Stored as \`status: "confirmed"\`. Requires backend availability logic. Only implement if specifically requested.

## Scheduler Config File
Create \`data/schedulerConfig.ts\`:

\`\`\`typescript
export const schedulerConfig = {
  businessName: "[BUSINESS NAME]",
  title: "Book an Appointment",
  description: "Choose a service, date, and time that works for you.",
  slotDurationMinutes: 30,
  bufferMinutes: 10,
  requireProviderSelection: false,
  requirePayment: false,

  services: [
    {
      id: "consultation",
      name: "Consultation",
      description: "A quick meeting to discuss what you need.",
      durationMinutes: 30,
      price: 0,
      depositRequired: false,
    },
  ],

  providers: [
    {
      id: "default",
      name: "[PROVIDER NAME]",
      role: "Owner",
      availableServices: ["consultation"],
    },
  ],

  businessHours: {
    monday:    [{ start: "09:00", end: "17:00" }],
    tuesday:   [{ start: "09:00", end: "17:00" }],
    wednesday: [{ start: "09:00", end: "17:00" }],
    thursday:  [{ start: "09:00", end: "17:00" }],
    friday:    [{ start: "09:00", end: "17:00" }],
    saturday:  [],
    sunday:    [],
  },

  blockedDates: [] as string[],

  customerFields: [
    { id: "name",  label: "Full Name",    type: "text",     required: true },
    { id: "phone", label: "Phone Number", type: "tel",      required: true },
    { id: "email", label: "Email",        type: "email",    required: true },
    { id: "notes", label: "Notes or Questions", type: "textarea", required: false },
  ],

  depositInstructions: "",
  paymentProvider: null,

  confirmationMessage: "Your request has been received. We'll confirm your appointment shortly.",
  adminNotificationEmail: "[ADMIN EMAIL]",
};
\`\`\`

## Customer Flow (7 Steps)
Step 1: Select Service → Step 2: Select Provider/Resource (if applicable) → Step 3: Select Date → Step 4: Select Time Slot → Step 5: Enter Customer Info → Step 6: Review Booking → Step 7: Confirmation Screen

Show step indicator at top. Allow back navigation on every step.

## Required Components
- **SchedulerContainer** — manages all state and current step
- **ServiceSelector** — selectable service cards with name, duration, price
- **ProviderSelector** — only renders if \`requireProviderSelection: true\` or multiple providers
- **DateSelector** — calendar UI, grays out past dates, closed days, blocked dates
- **TimeSlotSelector** — slots from business hours + slot duration + buffer; all shown in Request Mode
- **CustomerInfoForm** — renders fields from \`customerFields\` config dynamically
- **BookingReview** — summary of all selections, edit links, confirm button
- **BookingConfirmation** — success screen with confirmation message and "Book Another" button
- **AdminBookingCard** — status badge, service, provider, date, time, customer info, approve/cancel buttons
- **EmptyState** — "No available times on this date."
- **LoadingState** — skeleton/spinner for Instant Mode availability fetch

## API Route
\`app/api/bookings/route.ts\` — POST handler. In Request Mode: save with status "pending". In Instant Mode: check availability first. Connect to Supabase (see data-model.md in toolbox/modules/generic-scheduler/) or stub with TODO comment.

## Payment Placeholder
If any service has \`depositRequired: true\`: show payment step UI placeholder between BookingReview and submission. Add: \`// TODO: Integrate Stripe Checkout or Square Payment here\`. Do NOT wire real payments unless specifically requested.

## File Structure
\`\`\`
app/components/scheduler/
  SchedulerContainer.tsx
  ServiceSelector.tsx
  ProviderSelector.tsx
  DateSelector.tsx
  TimeSlotSelector.tsx
  CustomerInfoForm.tsx
  BookingReview.tsx
  BookingConfirmation.tsx
  AdminBookingCard.tsx
  EmptyState.tsx
  LoadingState.tsx
  index.ts
app/api/bookings/route.ts
data/schedulerConfig.ts
\`\`\`

## Styling Notes
- Default to neutral colors (gray, slate, white) so scheduler blends into any site
- Pass accent color as prop or Tailwind class variable
- All tap targets minimum 44px tall on mobile
- Use shared Button component from host site if it exists

## Example Configs by Business Type

**Barber Shop:** \`slotDurationMinutes: 30, bufferMinutes: 5, requireProviderSelection: true\`
**Salon:** \`slotDurationMinutes: 60, bufferMinutes: 15, requireProviderSelection: true, requirePayment: true\`
**Trainer:** \`slotDurationMinutes: 60, bufferMinutes: 0, requireProviderSelection: false\`
**Court Rental:** providers = courts/resources, \`requireProviderSelection: true\`
**Camp/Clinic:** services = sessions (AM/PM/Full Day), fixed time slots
**Consultation:** \`slotDurationMinutes: 30, bufferMinutes: 10, requireProviderSelection: false\`

## Placeholders
\`[BUSINESS NAME]\`, \`[PROVIDER NAME]\`, \`[ADMIN EMAIL]\`, \`[SERVICE NAME]\`, \`[PRICE]\``,
  },
];
