## Context

The booking-tour frontend (Next.js 16, App Router) already has a site layout with header and footer. The header and footer link to `/about`, but no page exists there. This change adds a static About page so that link resolves and users can read company/mission content. No backend or API is involved; content is frontend-only and static for now.

## Goals / Non-Goals

**Goals:**

- Add a public About page at `/about` that uses the existing (site) layout.
- Present company/mission (and optional sections such as values, team, contact CTA) in a clear, readable way.
- Match existing site styling and patterns (Tailwind, layout, typography).

**Non-Goals:**

- Backend or API for About content; no CMS or dynamic content in this change.
- SEO meta beyond basic title/description (can be added later).
- Localization or A/B testing of About content.

## Design reference

- **Source:** `docs/design/about/code.html` (structure + copy) and `docs/design/about/screen.png` (mockup).
- **Page structure (5 sections):**
  1. **Hero** – Full-width background image with overlay; label "Our Passion, Your Adventure"; headline "Crafting Memories Across the Globe"; subtitle (since 2010, mission to bridge cultures and connect people to the world's most breathtaking wonders).
  2. **Our Humble Journey** – Two columns: left = heading + two paragraphs (origin story, today in 50+ countries, philosophy) + three stats (50k+ Happy Travelers, 120+ Local Partners, 14 Years Experience); right = image + badge "Certified sustainable travel provider since 2015".
  3. **Why Choose GlobeTrotter?** – Three value cards: Hyper-Local Expertise (map icon), Uncompromising Safety (health_and_safety icon), Sustainable Impact (eco icon). Each: icon in primary/10 bg, title, short description.
  4. **Meet the Explorers** – Four team members with photo, name, role (e.g. Sarah Chen – Founder & CEO; Elena Rodriguez – Head of Operations; Marcus Thorne – Lead Adventure Guide; Aisha Khan – Experience Designer). Design uses grayscale image, color on hover.
  5. **CTA banner** – Primary-colored block: headline "Ready to start your next great adventure?", subtitle, two buttons: "Browse Tours" (primary action), "Contact Expert" (secondary). Optional decorative icon (e.g. globe) in background.

Design tokens in reference: primary `#1392ec`, Plus Jakarta Sans, Material Symbols Outlined. Align with existing site theme (e.g. `--color-primary`) where it already exists; otherwise follow design.

## Decisions

- **Route and layout**: Use `apps/web/app/(site)/about/page.tsx` so the page automatically gets the existing (site) layout (SiteHeader, SiteFooter). No new layout.
- **Content**: Static copy from design reference (`docs/design/about/code.html`). Keep copy in the page or a small constants/content file under the about feature. No database or API call.
- **Brand name on About page**: Follow the design copy (e.g. "GlobeTrotter" in section titles and body). Header/footer brand (e.g. TravelCo) is unchanged in this change; product can unify brand later if needed.
- **Images**: Use the same image URLs as in the design reference for consistency with mockup, or replace with project-hosted static assets / placeholders to avoid external dependencies. Prefer `apps/web/public` or placeholder if adding assets.
- **Components**: One page component plus optional presentational sections (e.g. Hero, JourneySection, ValuesGrid, TeamGrid, CTA) for readability. Reuse existing UI (e.g. `@repo/ui`, site Link/Button) where applicable.
- **Styling**: Tailwind CSS 4, consistent with the rest of the site. Match design reference for spacing, typography, and section layout; use existing theme (primary, backgrounds) where defined.

## Risks / Trade-offs

- **Static content**: Copy changes require a code deploy. Acceptable for this change; future work can introduce CMS or config-driven content.
- **No analytics events**: Out of scope here; can add later if needed.
