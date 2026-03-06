## Why

The platform lacks a dedicated Contact page where users can reach out for support, booking inquiries, or general questions. The About page already links to `/contact` via a CTA button, but the route doesn't exist yet. A Contact page is essential for user trust and support accessibility.

## What Changes

- Add a new public Contact page at `/contact` within the `(site)` layout
- Contact form with fields: full name, email, subject (dropdown), and message
- Left sidebar with contact methods: phone, email, office address
- Social media links section
- Embedded map section showing office location
- FAQ teaser section linking to a help center
- Frontend-only implementation (no backend API for form submission in this change)

## Capabilities

### New Capabilities
- `contact-page`: Public contact page with contact form, contact info cards, social links, map section, and FAQ teaser. Rendered within the site layout at `/contact`.

### Modified Capabilities
_None_ - no existing spec requirements are changing.

## Impact

- **Frontend**: New route `apps/web/app/(site)/contact/page.tsx` with associated components
- **Navigation**: Contact link in site header/footer should point to `/contact`
- **Dependencies**: Uses existing site layout (header/footer), Tailwind CSS, Material Symbols icons (already in use)
- **No backend changes**: Form submission is visual only in this change (no API endpoint)
