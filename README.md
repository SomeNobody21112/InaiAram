# InaiAram Web Application

The private product behind [inaiaram.com](https://inaiaram.com) — a consent-based matrimonial verification platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Preview

```bash
npm run build      # TypeScript check + production build
npm run preview    # Serve production build locally
```

## Stack

- **React 19** with TypeScript (strict mode)
- **Vite 8** for build tooling
- **Tailwind CSS 4** with custom design tokens
- **React Router 7** for client-side routing
- **Web Crypto API** for client-side SHA-256 hash chain (no dependencies)

## Architecture

```
src/
  routes/          # Page routes (landing, demo, privacy, terms, consent-notice, login)
  components/
    layout/        # Nav, Footer, Container, Section
    ui/            # Button, Card, StateChip, Accordion, Tabs, etc.
    sections/      # Landing page sections
    demo/          # Trust Profile demo application
    interactive/   # EvidenceThread, ConsentLedger, AskKit, ScopeBuilder
  lib/             # Hash chain cryptography (hashChain.ts)
  config/          # Company configuration (company.ts)
  content/         # Display strings (en.ts) — ready for translation
  data/            # Illustrative sample data (marked as fiction)
  hooks/           # useTheme, useReveal, useSelectedClaim
  styles/          # Design tokens and base CSS
```

## Design System

The design system is built on CSS custom properties defined in `src/styles/tokens.css`, mapped into Tailwind via the `@theme` directive.

**Tokens:** `--bg`, `--bg-alt`, `--surface`, `--surface-raised`, `--line`, `--line-strong`, `--ink`, `--ink-2`, `--ink-3`, `--terracotta`, `--terracotta-deep`, `--gold`, `--gold-soft`, `--sage`, `--taupe`

**Typography:** Three-font system:
- Display serif (Playfair Display) — headlines only
- UI sans (Inter) — body, navigation, buttons
- Mono (JetBrains Mono) — labels, eyebrows, metadata

**Themes:** Light (warm ivory) and dark (warm near-black brown). Toggled via `data-theme` on `<html>`, persisted to `localStorage` (the only permitted storage).

## How Theming Works

- Theme preference stored in `localStorage` as `'inaiaram-theme'`
- Applied before first paint via inline `<script>` in `index.html`
- Toggled by `useTheme()` hook
- `data-theme="dark"` selector activates dark CSS custom properties
- Only `background-color`, `border-color`, and `color` are transitioned (200ms)

## What Is Mocked

**Everything.** This is a frontend prototype. There is:

- No backend
- No database
- No network calls
- No analytics
- No third-party scripts
- No personal data stored (except theme preference)
- No real verification integrations

All sample data lives in `src/data/` and is clearly marked as illustrative. The hash chain in `src/lib/hashChain.ts` uses real Web Crypto SHA-256 but operates entirely client-side on fictional receipt data.

**The mock boundary is explicit:** every interactive flow displays a notice reading "Prototype — nothing is submitted, stored or transmitted."

## company.ts — What the Founder Edits

`src/config/company.ts` is the single source of truth for unconfirmed business facts:

```ts
export const company = {
  legalName: { value: null, confirmed: false, fallback: "InaiAram" },
  // ...
  showPrices: false,           // flip to true when pricing is confirmed
  healthModuleStatus: "planned", // change to "live" when ready
  crossBorderStatus: "planned",  // change to "live" when ready
};
```

- If `confirmed === false` and a fallback exists, the fallback renders
- If no fallback, the element collapses cleanly (no empty boxes)
- `showPrices: false` renders "Pricing shared on enquiry" on all package cards
- `namedRecordSystems` and `statistics` are empty by default

## No Secrets

There are **no API keys, tokens, credentials, or environment variables** in this build. No `.env` file is required. The build works with zero configuration.

## Known Limitations of This Prototype

1. **No real authentication** — routes are accessible without login; the login page is a stub
2. **No responsive image optimization** — SVGs are inline but no image assets exist
3. **Font loading** — Google Fonts CDN is used; self-hosting would improve privacy
4. **No offline support** — service worker not implemented
5. **No unit tests** — the project has no test runner configured
6. **Search engine optimization** — no server-side rendering
7. **The hash chain** is client-side only; a production system would need server-side chain validation
8. **Accessibility** — WCAG 2.2 AA targets are designed for but not formally audited with automated tools

## Security Notes

See `SECURITY.md` for the full security review. Key points:

- No `dangerouslySetInnerHTML` in source code
- No `target="_blank"` without `rel="noopener noreferrer"`
- No network requests on any interaction
- Focus styles visible in both themes
- Theme preference is the only localStorage entry
