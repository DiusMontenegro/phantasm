<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Agent Guide - PHANTASM YT AI

> Build only what the PRD requires. Avoid over-engineering. Focus on delivering a polished MVP using Next.js, Clerk, OpenRouter, and a premium YouTube-inspired UI.

---

# 1. Mission

Build PHANTASM YT AI, a modern YouTube-inspired web application that allows authenticated users to watch videos, chat with AI, switch AI models, and perform AI-powered searches with a premium user experience.

The code, config, and committed content are the source of truth. If this file and the code disagree, trust the code and flag the mismatch.

---

# 2. Document System

| File              | Answers                        | Owner |
| ----------------- | ------------------------------ | ----- |
| `PRD.md`          | What and why                   | Owner |
| `PLAN.md`         | Build order and execution plan | Agent |
| `AGENTS.md`       | Development rules              | Owner |
| `ARCHITECTURE.md` | System implementation details, when created | Agent |
| `docs/decisions/` | ADRs                           | Agent |

Rules:

- Work only from approved PRD requirements.
- Do not implement speculative features.
- Scope changes must start in PRD.md.
- MVP delivery is more important than extensibility.

---

# 3. Working Loop

**INSPECT → PLAN → IMPLEMENT → VALIDATE → REPORT → WAIT**

Rules:

- Complete one PLAN.md step at a time.
- Never automatically proceed.
- Stop after every validated step.
- Wait for explicit approval before continuing.
- Keep changes small and focused.
- Provide exact file paths and commands.

Communication:

- Concise
- Direct
- Friendly
- Practical
- Filipino-English acceptable

---

# 4. Architecture

## Application Structure

Single Next.js application.

No separate backend.

No microservices.

No Docker.

No database.

No queues.

No workers.

No CMS.

## Deployment

Deploy only to Vercel.

Never assume:

- Domain exists
- Project is linked
- Environment variables exist

Always verify.

## Architecture Pattern

```text
app/
  routes

features/
  auth
  videos
  chat
  search

server/
  openrouter
  auth
  services

components/
  shared ui

lib/
  utils
  config
```

Dependencies flow inward only:

```text
app
 ↓
features
 ↓
server
 ↓
lib
```

---

# 5. Project At A Glance

- Product: PHANTASM YT AI
- Stage: MVP
- Framework: Next.js App Router
- Language: TypeScript Strict
- Styling: Tailwind CSS + shadcn/ui
- Database: None
- Authentication: Clerk
- AI Provider: OpenRouter
- Payments: None
- React query: for infinite scrolling
- CMS: None
- Analytics: None
- Package Manager: npm
- Deployment: Vercel

## MVP Scope

The MVP includes only:

### Public Pages

- Landing Page
- Sign In
- Sign Up

### Protected Pages

- Dashboard

### Features

- Clerk Authentication
- Login
- Signup
- Logout
- Route Protection
- YouTube Style Layout
- Video Grid
- Playable Videos
- AI Chat Widget
- AI Model Selector
- Conversational AI Search Capability
- Light Theme
- Dark Theme
- Responsive Design

### Out Of Scope

- Database
- User uploads
- Playlists
- Likes
- Comments
- Video creation
- Payments
- Subscriptions
- User profiles
- Admin panel
- Notifications
- Email marketing
- Multi-tenancy
- Docker
- CMS

---

# 6. Prime Directives

1. Do not fabricate functionality.
2. Verify before claiming.
3. Inspect before editing.
4. Smallest complete change.
5. Preserve working behavior.
6. Follow the PRD exactly.
7. MVP > Scalability.
8. MVP > Abstraction.
9. Do not build future features.

Special Rule:

If a feature is not explicitly listed in PRD.md, do not build it.

---

# 7. Start Every Task

Always read:

```text
AGENTS.md
PRD.md
PLAN.md
ARCHITECTURE.md
```

If `ARCHITECTURE.md` does not exist yet, continue with the available project documents and do not fabricate architecture details.

Then:

```bash
git status --short
```

Then inspect:

```text
package.json
next.config.*
tsconfig.json
.env.example
```

Then inspect the route being modified.

Then inspect relevant Next.js docs.

---

# 8. Rendering Boundaries

Use Server Components by default.

Only use `"use client"` when:

- State is required
- Events are required
- Browser APIs are required

OpenRouter API calls:

- Server Side Only

Clerk auth checks:

- Server Side Only

Never expose secrets to the browser.

---

# 9. Directory Conventions

```text
app/
components/
components/ui/
features/auth/
features/chat/
features/search/
features/videos/
server/openrouter/
server/auth/
lib/
types/
public/
tests/
docs/
```

Feature ownership:

```text
auth → Clerk
chat → AI chat
search → AI search
videos → video feed
```

---

# 10. Coding Standards

## Naming

Components:

```text
PascalCase.tsx
```

Utilities:

```text
camelCase.ts
```

Assets:

```text
kebab-case
```

## TypeScript

Rules:

- strict mode
- no any
- use Zod validation
- use inferred types
- no unsafe assertions

## Code Quality

Rules:

- Single responsibility
- Early returns
- No deep nesting
- No dead code
- No commented code
- No console.log
- Reusable components

Every page must include:

- Loading State
- Error State
- Empty State

---

# 11. Dependencies

Approved Packages:

```text
next
react
typescript
tailwindcss
shadcn/ui
clerk
openrouter sdk (or fetch api)
zod
lucide-react
```

Rules:

- Do not install unnecessary packages.
- Do not install a second UI framework.
- Do not install Redux.
- Do not install Zustand.
- Do not install Prisma.
- Do not install database libraries.

Get approval before adding dependencies.

---

# 12. Authentication

Authentication provider:

```text
Clerk
```

Requirements:

- Clerk middleware
- Protected dashboard route
- Server-side auth validation

Required flows:

- Sign Up
- Sign In
- Logout

No custom auth implementation.

No JWT implementation.

No database sessions.

Clerk is source of truth.

---

# 13. AI Features

Provider:

```text
OpenRouter
```

Environment Variable:

```env
OPENROUTER_API_KEY=
```

## Allowed Models

Default:

```text
nvidia/nemotron-3-ultra-550b-a55b:free
```

Optional:

```text
nvidia/nemotron-3.5-super-vl:free
```

Optional:

```text
dots-studio/dots-3-note-preview:free
```

## AI Requirements

Must support:

- Chat
- Streaming responses
- Model switching
- Error handling
- Loading states

Rules:

- Server side only
- No API key exposure
- Validate prompts
- Rate limit requests
- AI Chat is question-and-answer only and must never perform video discovery.
- AI Search is a separate conversational feature that interprets follow-up requests and returns video results.

---

# 14. Security

Requirements:

- Clerk authentication
- Environment variable validation
- Protected routes
- API key protection
- Input validation

Never:

- Commit secrets
- Commit .env files
- Expose OpenRouter keys

Create:

```text
lib/env.ts
```

for environment validation.

---

# 15. Design System

Style Direction:

- Apple Inspired
- Premium
- Modern
- Clean
- Glassmorphism accents
- YouTube-inspired layout

Theme Support:

- Light
- Dark
- System

Typography:

```text
Inter
Poppins
```

UI Goals:

- Professional
- Fast
- Responsive
- Minimal

## Current Implementation Decisions

- The public landing experience uses dark glassmorphism with restrained animated gradients.
- The dashboard is dark-first with a persistent light/dark theme toggle.
- Theme initialization remains deterministic across server and client renders.
- Video discovery uses RapidAPI server-side; playback uses YouTube privacy-enhanced embeds.
- Question-only AI Chat streams responses from a floating dashboard widget and exposes the approved model selector.
- AI Search remains separate from AI Chat and must support conversational follow-ups.

Avoid:

- Excessive animations
- Neon effects
- Overly complex visuals

---

# 16. Responsive And Accessibility

Support:

```text
320px
768px
1024px
1440px
```

Requirements:

- Mobile First
- Keyboard Accessible
- Accessible Forms
- Focus States
- WCAG AA

---

# 17. Performance

Targets:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
```

Rules:

- Server render when possible
- Minimize client components
- Use next/image
- Avoid unnecessary dependencies
- Lazy load heavy UI

---

# 18. SEO

Required:

- Metadata API
- sitemap.ts
- robots.ts

Private pages:

```text
noindex
```

Public pages:

```text
Landing Page
Sign Up
Sign In
```

Only create SEO content that exists.

---

# 19. Testing

Required Journeys:

1. Sign Up
2. Sign In
3. Logout
4. Dashboard Access
5. Video Playback
6. AI Chat
7. Model Switching
8. Theme Switching

Testing Priority:

```text
Playwright E2E
```

Additional:

```text
Typecheck
Lint
Build
```

---

# 20. Validation

Before marking a task complete:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

If tests exist:

```bash
npm run test
npm run test:e2e
```

Report actual results only.

Never claim a check passed unless executed.

---

# 21. Deployment

Provider:

```text
Vercel
```

Environments:

```text
Development
Preview
Production
```

Required Variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OPENROUTER_API_KEY=
RAPIDAPI_KEY=
```

Never invent deployment URLs.

Verify first.

---

# 22. Reporting Format

After each completed step provide:

## What Changed

Brief summary.

## Files Changed

List exact files.

## Validation

Commands run and actual result.

## Not Verified

Anything not tested.

## Assumptions

Any assumptions made.

## Next Recommended Step

Optional.

Then stop and wait for approval.
