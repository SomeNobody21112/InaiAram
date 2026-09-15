# Security Review — InaiAram Web Application Prototype

## What This Is

This is a **frontend-only prototype**. It has no backend, no database, no server-side logic, and no real authentication. It is designed to demonstrate the product experience and visual design of the InaiAram verification platform.

## What This Is Not

This is **not a production-grade secure application**. Frontend measures alone cannot secure a verification platform. A production system requires:

- Server-side authentication and authorisation
- Per-recipient encryption of shared claims
- An append-only access log maintained server-side
- Rate limiting per subject and per requester
- Mandatory human review of adverse findings
- Independent security audit and penetration testing
- HTTPS enforcement and HSTS
- Content Security Policy headers
- CORS configuration
- Database encryption at rest
- Secure session management

## What Was Reviewed

### XSS Prevention
- **No `dangerouslySetInnerHTML`** in any source file
- All user-facing content is rendered through React's JSX, which auto-escapes
- The only user input is the email field in the Scope Builder, which uses controlled input state

### Unsafe URLs
- No `javascript:` scheme links
- No external redirects from user input
- All navigation uses React Router's `<Link>` component

### `target="_blank"` Usage
- No instances of `target="_blank"` in source code

### Secrets
- **No API keys, tokens, credentials, or endpoints** anywhere in source code, comments, or `.env` files
- No `.env` file exists; no environment variables are required
- The build works with zero configuration

### Client-Side Storage
- **Only one localStorage entry:** `'inaiaram-theme'` containing `'light'` or `'dark'`
- No `sessionStorage` usage
- No cookies set by application code
- No personal data persisted anywhere

### Network Requests
- **No network requests fire on any user interaction**
- The only external request is the Google Fonts CSS import (for font loading)
- No analytics, tracking pixels, or third-party scripts

### Input Validation
- The email field in the Scope Builder is validated client-side
- No data is submitted to any server
- No form posts exist

### Dependency Audit
- Run `npm audit` before deployment
- Address any high or critical vulnerabilities

## What Was Fixed During Review

1. Removed unused variables flagged by TypeScript strict mode
2. Ensured no data leaves the browser on any interaction
3. Verified focus styles are visible in both light and dark themes
4. Confirmed `prefers-reduced-motion` is respected throughout
5. Added skip-to-content link for keyboard navigation
6. All interactive elements have appropriate ARIA attributes

## Honest Boundary

This prototype demonstrates the **experience** of InaiAram. It does not implement the **security** of InaiAram. Do not deploy this as if it were production-ready. The security architecture for a production verification platform is a separate, critical workstream.
