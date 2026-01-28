# Signal Harvester — Code Review

**Reviewer:** Max (automated deep review)  
**Date:** 2026-01-28  
**Scope:** Full codebase — frontend, backend, deployment, infrastructure

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Critical Issues](#3-critical-issues)
4. [Frontend Review](#4-frontend-review)
5. [Backend Review](#5-backend-review)
6. [Deployment & Infrastructure](#6-deployment--infrastructure)
7. [SEO & Marketing](#7-seo--marketing)
8. [Security](#8-security)
9. [Recommendations](#9-recommendations)
10. [Priority Action Items](#10-priority-action-items)

---

## 1. Executive Summary

Signal Harvester is currently a **landing page + waitlist** — not a product yet. The landing page design is polished and the copy is compelling, but there are several technical issues that need fixing before it's ready for serious traffic.

**What's good:**
- Clean, modern UI with nice visual mockups (phone frames, comment simulations)
- Compelling copy that explains the value proposition clearly
- Solid deployment setup (Kamal + Docker + PostgreSQL + Let's Encrypt)
- Good Docker multi-stage build
- Graceful shutdown handling in server

**What needs work:**
- 🔴 **Tailwind via CDN** — not production-ready (massive download, no tree-shaking)
- 🔴 **Google AI Studio scaffolding leftovers** — import maps, Gemini API key refs
- 🟡 **No rate limiting** on waitlist API
- 🟡 **No SEO meta tags** (Open Graph, description, favicon)
- 🟡 **External image dependencies** that could break (Unsplash, DiceBear, Giphy)
- 🟡 **No analytics** (no way to measure waitlist conversion)

**Verdict:** ~3-4 hours of polish to make production-ready. Design and copy are solid.

---

## 2. Architecture Overview

```
Signal Harvester
├── Frontend (React 19 + Vite + Tailwind CDN)
│   ├── Landing page with 6 sections
│   ├── Waitlist form (email + platform)
│   └── No routing (single page)
├── Backend (Express + PostgreSQL)
│   ├── POST /api/waitlist
│   ├── GET /up (health check)
│   └── SPA fallback
└── Deployment (Kamal → DigitalOcean)
    ├── Docker multi-stage build
    ├── PostgreSQL accessory
    └── Traefik + Let's Encrypt SSL
```

Total codebase: **~1,200 lines** across 10 files. Lean and focused.

---

## 3. Critical Issues

### 🔴 3.1 Tailwind CSS via CDN (NOT production-ready)

**File:** `index.html`

```html
<script src="https://cdn.tailwindcss.com"></script>
```

This is the **development-only CDN** version. In production, this:
- Downloads the ENTIRE Tailwind library (~300KB+ compressed)
- Generates styles at runtime in the browser (slow first paint)
- Tailwind's own docs explicitly say: "Don't use the CDN for production"

**Fix:** Install Tailwind as a build dependency, configure with PostCSS, and let Vite tree-shake unused classes. Final CSS should be ~10-20KB.

### 🔴 3.2 Google AI Studio Scaffolding Leftovers

**File:** `index.html` — Contains an import map referencing `@google/genai`:
```html
<script type="importmap">
{
  "imports": {
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.30.0",
    ...
  }
}
</script>
```

**File:** `vite.config.ts` — References unused Gemini API key:
```ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**File:** `metadata.json` — Google AI Studio metadata file (not needed):
```json
{
  "name": "Signal Harvester - Intent Outreach",
  "requestFramePermissions": []
}
```

These are remnants from the project being scaffolded in Google AI Studio. They add confusion and unnecessary code.

**Fix:** Remove import map, Gemini API key references, and metadata.json.

---

## 4. Frontend Review

### 4.1 Component Quality: ✅ Good

Components are well-structured, self-contained, and use TypeScript properly. The visual design is polished with nice touches:
- Phone frame mockups in Hero
- Auto-scrolling marquee carousel
- Spotlight hover effect on feature cards
- Smooth animations and transitions

### 4.2 Issues

| Issue | Severity | File |
|-------|----------|------|
| No `<meta description>` tag | 🟡 Medium | `index.html` |
| No Open Graph / Twitter Card tags | 🟡 Medium | `index.html` |
| No favicon | 🟡 Medium | `index.html` |
| External images (Unsplash, DiceBear, Giphy) could break | 🟡 Medium | Multiple components |
| No error boundary wrapping the app | 🟢 Low | `App.tsx` |
| Copyright says "© 2025" — should be 2026 | 🟢 Low | `App.tsx` |
| `GeneratedInteraction` type is unused | 🟢 Low | `types.ts` |
| Footer links (Privacy, Terms, Twitter) go to `#` | 🟢 Low | `App.tsx` |
| No loading states / skeleton UI | 🟢 Low | - |
| `index.css` referenced in HTML but doesn't exist | 🟢 Low | `index.html` |

### 4.3 Performance Concerns

- **Marquee animation** uses `requestAnimationFrame` constantly — good approach, but runs even when tab is inactive. Should use `IntersectionObserver` to pause when off-screen.
- **Image lazy loading** not used for below-fold images
- **No font optimization** — Inter is referenced but not loaded (relies on system fallback or CDN having it cached)

### 4.4 Accessibility

- Missing `alt` text on some images
- No skip navigation link
- Form doesn't have proper `aria-label` attributes
- Radio buttons hidden with `className="hidden"` but no visible focus indicator on the label

---

## 5. Backend Review

### 5.1 Server (`server/index.js`): ✅ Solid

- Clean Express setup
- Proper error handling middleware
- Graceful shutdown on SIGTERM/SIGINT
- Health check endpoint for Kamal

### 5.2 Database (`server/db.js`): ✅ Good

- Connection pooling configured
- Schema migration on startup
- Proper indexes on email and created_at
- `ON CONFLICT` upsert prevents duplicates

### 5.3 Issues

| Issue | Severity | File |
|-------|----------|------|
| No rate limiting on `/api/waitlist` | 🟡 Medium | `server/index.js` |
| CORS is wide open (`cors()` with no options) | 🟡 Medium | `server/index.js` |
| No request body size limit | 🟡 Medium | `server/index.js` |
| Error handler signature has unused `next` (lint) | 🟢 Low | `server/index.js` |
| Pool `ssl: false` hardcoded — should be env-based | 🟢 Low | `server/db.js` |
| `getWaitlistCount()` exported but never used | 🟢 Low | `server/db.js` |

### 5.4 Missing Features

- **Admin endpoint** to view waitlist count/entries (protected)
- **Export endpoint** for CSV download
- **Webhook/notification** when someone joins (email or Slack alert)

---

## 6. Deployment & Infrastructure

### 6.1 Docker: ✅ Excellent

Multi-stage build is well done:
- Stage 1: Build frontend with Node 20
- Stage 2: Production image with only backend + built assets
- Health check configured
- Clean separation of concerns

### 6.2 Kamal Config: ✅ Good

- SSL auto-provisioning via Let's Encrypt
- PostgreSQL as accessory
- Health check on `/up`
- Proper boot limit

### 6.3 Issues

| Issue | Severity |
|-------|----------|
| `DEPLOYMENT.md` is overly verbose (2+ pages) for a simple setup | 🟢 Low |
| No backup strategy for PostgreSQL | 🟡 Medium |
| No CI/CD pipeline (no GitHub Actions) | 🟡 Medium |

---

## 7. SEO & Marketing

This is a **landing page** — SEO and conversion optimization are critical.

### 7.1 Missing

- **Meta description** — Google will use random page text as snippet
- **Open Graph tags** — shared links on social media will look plain
- **Twitter Card tags** — same issue
- **Favicon** — tab shows default browser icon
- **Structured data** (JSON-LD) — nice to have for SaaS product
- **Google Analytics / Plausible / PostHog** — no way to measure traffic
- **Waitlist count display** — social proof ("500+ people already waiting")
- **No UTM parameter handling** — can't track which channels drive signups

### 7.2 Copy Issues

- "© 2025 Signal Harvester" → Should be 2026
- Footer links (Privacy, Terms) are dead `#` links
- README says "© 2024 Signal Harvester" — yet another year

---

## 8. Security

| Issue | Status |
|-------|--------|
| SQL injection | ✅ Protected (parameterized queries) |
| XSS | ✅ React handles escaping |
| CORS | ⚠️ Wide open (should restrict to domain) |
| Rate limiting | ❌ None (spam risk) |
| Input validation | ✅ Email regex + platform check |
| SSL | ✅ Auto via Let's Encrypt |
| Secrets management | ✅ Via Kamal secrets / .env |
| Helmet headers | ❌ Not installed |
| Body size limit | ❌ No limit (memory exhaustion risk) |

---

## 9. Recommendations

### Immediate (before sharing the URL widely)

1. **Replace Tailwind CDN with proper build** — install `tailwindcss`, `postcss`, `autoprefixer`
2. **Remove Google AI Studio leftovers** — import map, Gemini API key, metadata.json
3. **Add SEO meta tags** — description, OG tags, Twitter cards, favicon
4. **Add rate limiting** — `express-rate-limit` on waitlist endpoint
5. **Add analytics** — even just Plausible (privacy-friendly, 1 line of code)
6. **Fix copyright year** to 2026

### Soon (next sprint)

7. **Add CI/CD** — GitHub Actions to build, test, and deploy on push
8. **Add notification** when someone joins waitlist (email/Slack webhook)
9. **Show waitlist count** on the page for social proof
10. **Self-host images** — download Unsplash/DiceBear images to `public/`
11. **Add Helmet** for security headers
12. **Restrict CORS** to `signalharvester.com`

### Later (when building the actual product)

13. Design the actual product architecture (comment scanning, AI analysis, reply generation)
14. Add user authentication
15. Build TikTok/Instagram API integrations
16. Create pricing/billing with Stripe

---

## 10. Priority Action Items

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Proper Tailwind build (replace CDN) | High | 30 min |
| 2 | Remove AI Studio leftovers | High | 10 min |
| 3 | Add SEO meta tags + favicon | High | 20 min |
| 4 | Add rate limiting | Medium | 15 min |
| 5 | Fix copyright year | Low | 2 min |
| 6 | Add analytics (Plausible) | Medium | 5 min |
| 7 | Self-host images | Medium | 30 min |
| 8 | Add basic CI/CD | Medium | 45 min |

**Total estimated effort for items 1-6: ~1.5 hours**

---

*Review complete. The landing page looks great visually — the main work is cleaning up the build pipeline and adding production essentials (SEO, rate limiting, analytics). The actual product (comment scanning, AI agent) doesn't exist yet and will be a separate major effort.*
