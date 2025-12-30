# Login Screen

## Overview

The login screen allows users to authenticate using email/password or social providers (Google, Apple).

## Design Reference

- **Design file**: `docs/Fe/design/login_page/screen.png`
- **HTML reference**: `docs/Fe/design/login_page/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-001` |
| Route | `/login` |
| Access | Anonymous only (redirect if authenticated) |
| Layout | Auth Layout (no header/sidebar) |

## Key Features

1. Email/password login
2. Social login (Google, Apple)
3. Forgot password link
4. Sign up link
5. Hero image with testimonial

## Related Documents

- [01_screen_spec.md](./01_screen_spec.md) - Screen specification
- [02_api_contract.md](./02_api_contract.md) - API contract
- [03_acceptance_criteria.md](./03_acceptance_criteria.md) - Test scenarios
- [04_resource_mapper.md](./04_resource_mapper.md) - Data mapping
