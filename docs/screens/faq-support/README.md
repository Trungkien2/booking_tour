# FAQ & Support Screen

## Overview

Help center page with frequently asked questions organized by topic and multiple support contact options.

## Design Reference

- **Design file**: `docs/Fe/design/faq_&_support_page/screen.png`
- **HTML reference**: `docs/Fe/design/faq_&_support_page/code.html`

## Screen Information

| Item | Value |
|------|-------|
| Screen ID | `SCR-016` |
| Route | `/faq` or `/support` |
| Access | Public |
| Layout | Main Layout |

## Key Features

1. Hero section with search
2. Browse by topic categories
3. FAQ accordion
4. Contact support section
5. Live chat option

## UI Components

### Hero Section
```yaml
background:
  type: "gradient"
  colors: ["blue-dark", "blue-light"]

content:
  title: "Hello! How can we help you today?"
  subtitle: "Find answers to your questions about bookings, tours, and more."

search:
  placeholder: "Search for questions..."
  icon: "Search"
  suggestions: true

quick_links:
  - "Cancellations"
  - "Payment Methods"
  - "Group bookings"
```

### Browse by Topic
```yaml
title: "Browse by Topic"

categories:
  - id: "bookings"
    icon: "Calendar"
    label: "Booking & Payments"
    description: "Managing reservations"
    link: "/faq?topic=bookings"

  - id: "cancellations"
    icon: "XCircle"
    label: "Cancellations"
    description: "Refund policies"
    link: "/faq?topic=cancellations"

  - id: "tours"
    icon: "Map"
    label: "Tour Details"
    description: "What to expect"
    link: "/faq?topic=tours"

  - id: "account"
    icon: "User"
    label: "Account"
    description: "Profile & settings"
    link: "/faq?topic=account"

layout: "4-column grid"
```

### FAQ Accordion
```yaml
title: "Frequently Asked Questions"

items:
  - question: "Can I cancel my booking for a full refund?"
    answer: "Yes, you can cancel up to 7 days before your tour date for a full refund..."
    expanded: false

  - question: "What happens if it rains during the tour?"
    answer: "Tours generally proceed in light rain. In case of severe weather..."
    expanded: false

  - question: "Do you offer hotel pick-up services?"
    answer: "Yes, most of our tours include complimentary hotel pick-up..."
    expanded: false

  - question: "How do I receive my tickets?"
    answer: "E-tickets will be sent to your email immediately after booking..."
    expanded: false

show_more:
  label: "View all FAQs"
  link: "/faq/all"
```

### Still Need Help Section
```yaml
title: "Can't find what you're looking for?"
subtitle: "Our customer support team is available 24/7 to help you."

contact_options:
  - id: "phone"
    icon: "Phone"
    title: "Customer Support"
    description: "Available 24/7"
    action:
      label: "Call us"
      link: "tel:+1234567890"

  - id: "chat"
    icon: "MessageCircle"
    title: "Live Chat"
    description: "Get instant help"
    action:
      label: "Start Chat"
      action: "open_chat_widget"

  - id: "email"
    icon: "Mail"
    title: "Email Support"
    description: "Response within 24h"
    action:
      label: "Send Email"
      link: "mailto:support@example.com"

layout: "3-column grid"
```

### Footer Section
```yaml
columns:
  brand:
    name: "TourBooker"
    description: "Your trusted travel partner"
    social:
      - platform: "Facebook"
        link: "#"
      - platform: "Twitter"
        link: "#"
      - platform: "Instagram"
        link: "#"

  company:
    title: "Company"
    links:
      - "About Us"
      - "Careers"
      - "Press"

  support:
    title: "Support"
    links:
      - "Help Center"
      - "Contact Us"
      - "Privacy Policy"

  legal:
    title: "Legal"
    links:
      - "Terms of Service"
      - "Privacy Policy"
      - "Cookie Policy"
```

## Search Functionality

### Search Behavior
```yaml
trigger: "Type in search box"
debounce: 300ms

actions:
  - Search FAQ questions
  - Search FAQ answers
  - Show suggestions dropdown
  - Highlight matching text

no_results:
  message: "No results found for '{query}'"
  suggestion: "Try different keywords or browse by topic"
```

## API Endpoints

```yaml
GET /faq:
  params:
    - topic: string (optional)
    - search: string (optional)
  response:
    - categories: Topic[]
    - faqs: FAQ[]

GET /faq/search:
  params:
    - q: string
  response:
    - results: FAQ[]
    - suggestions: string[]

POST /support/contact:
  body:
    - name: string
    - email: string
    - subject: string
    - message: string
  description: Submit support request
```

## Related Documents

- 01_screen_spec.md
- 02_api_contract.md
- 03_acceptance_criteria.md
- 04_resource_mapper.md
