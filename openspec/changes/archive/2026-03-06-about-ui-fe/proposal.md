## Why

The site header and footer already link to `/about`, but no About page exists. Users clicking "About" get a 404. We need a dedicated About page to present the company, mission, and optionally team/contact so the link is meaningful and the site feels complete.

## What Changes

- Add a public **About** page at route `/about` under the existing (site) layout.
- Page content: company/mission narrative, optional sections (e.g. team, values, contact CTA).
- Reuse existing site layout (SiteHeader, SiteFooter); no new backend or API.
- Content can be static (hardcoded or CMS later); this change is frontend-only.

## Capabilities

### New Capabilities

- `about-page`: Public About page at `/about` with company/mission content and optional sections (e.g. team, values, contact), using the existing site layout and styling conventions.

### Modified Capabilities

- None. (No existing specs in `openspec/specs/`; header/footer links are implementation details, not requirement changes.)

## Impact

- **Frontend**: New route `apps/web/app/(site)/about/page.tsx` and any shared components or copy used only on About.
- **No backend/API changes**: Content is static for this change.
- **Dependencies**: None new; use existing Next.js 16 App Router, Tailwind, and (site) layout.
