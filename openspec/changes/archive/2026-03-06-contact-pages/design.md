## Context

The platform currently has public pages (home, tours, about, auth) rendered within a `(site)` layout group in Next.js. The About page already contains a CTA linking to `/contact`, but this route does not exist. A design reference (HTML + screenshot) exists at `docs/design/contact/`.

The contact page is frontend-only — it displays a contact form, contact info, social links, a map section, and an FAQ teaser. No backend API is needed for this change (form submission is visual-only).

## Goals / Non-Goals

**Goals:**
- Implement a pixel-faithful Contact page matching the existing design reference
- Reuse the site layout (header/footer) for consistent navigation
- Follow the same component and styling patterns established by the About page
- Ensure responsive design (mobile, tablet, desktop)

**Non-Goals:**
- Backend form submission API (future change)
- Email notification system
- Live chat integration
- FAQ/Help center page (the teaser links to it but the page itself is out of scope)
- Google Maps embed (use a static map image placeholder)

## Decisions

### 1. Single page component vs. extracted sub-components
**Decision**: Implement as a single `page.tsx` file with inline sections, matching the About page pattern.
**Rationale**: The About page uses a single file approach. The contact page is similarly sized. Consistency with existing patterns is preferred over premature extraction.

### 2. Static content with constants
**Decision**: Store contact info (phone, email, address) and social links as typed constants at the top of the file, same as the About page stores `TEAM` data.
**Rationale**: Keeps content easy to update without prop drilling. Consistent with About page pattern.

### 3. Form handling
**Decision**: Use a standard HTML form with no submission logic. The submit button is present but non-functional.
**Rationale**: Backend form handling is explicitly a non-goal. Adding client-side state or validation would be premature without an API to submit to.

### 4. Map section
**Decision**: Use a static image for the map with an overlay card showing the address, matching the design reference.
**Rationale**: Embedding Google Maps requires an API key and adds complexity. A static image matches the design and can be swapped for an interactive map later.

### 5. Icons
**Decision**: Use Material Symbols Outlined (already loaded globally via Google Fonts).
**Rationale**: The design uses material icons (`call`, `mail`, `location_on`, `public`, `share`, `camera`, `chat`, `arrow_forward`). These are already available in the project.

## Risks / Trade-offs

- **[Static form]** Users may try to submit the form and get no feedback → Add a visual-only state or placeholder toast in a follow-up change
- **[Static map image]** The map image from the design reference is an external URL that could break → Acceptable for now; can be replaced with a real map embed later
- **[No validation]** Form fields have no client-side validation → Acceptable since form doesn't submit; validation will come with the backend integration
