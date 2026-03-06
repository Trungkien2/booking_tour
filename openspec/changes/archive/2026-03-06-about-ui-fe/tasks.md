## 1. Route and page shell

- [x] 1.1 Add `apps/web/app/(site)/about/page.tsx` that renders within the existing (site) layout
- [x] 1.2 Set page metadata (title "About Us", description) via Next.js metadata export

## 2. Hero section

- [x] 2.1 Implement hero: full-width background image with dark overlay, centered text (label "Our Passion, Your Adventure", headline "Crafting Memories Across the Globe", subtitle from design)
- [x] 2.2 Style hero with Tailwind (min-height, typography, responsive) per `docs/design/about/code.html`

## 3. Our Humble Journey section

- [x] 3.1 Two-column layout: left = heading "Our Humble Journey", two paragraphs (origin story + philosophy), three stats (50k+ Happy Travelers, 120+ Local Partners, 14 Years Experience)
- [x] 3.2 Right column: image + overlay badge "Certified sustainable travel provider since 2015" (icon + text)

## 4. Why Choose section (values)

- [x] 4.1 Section heading "Why Choose GlobeTrotter?" and subtitle
- [x] 4.2 Three value cards: Hyper-Local Expertise (map), Uncompromising Safety (health_and_safety), Sustainable Impact (eco); each with icon, title, description per design

## 5. Meet the Explorers section

- [x] 5.1 Section heading "Meet the Explorers" and subtitle
- [x] 5.2 Grid of four team members: photo, name, role (Sarah Chen – CEO, Elena Rodriguez – Head of Operations, Marcus Thorne – Lead Adventure Guide, Aisha Khan – Experience Designer); optional grayscale/hover effect per design

## 6. CTA banner

- [x] 6.1 Primary-colored CTA block: headline "Ready to start your next great adventure?", subtitle, optional decorative background icon
- [x] 6.2 Two buttons: "Browse Tours" (link to /tours), "Contact Expert" (link to /contact or #)

## 7. Verification

- [x] 7.1 Confirm `/about` returns 200 and displays with site header and footer
- [x] 7.2 Confirm "About" links in header and footer navigate to `/about` and show the new page
