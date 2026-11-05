# PRD - PHANTASM YT AI

> **Purpose:** This document defines WHAT is being built and WHY. It serves as the single source of truth for the MVP.

| Field        | Value           |
| ------------ | --------------- |
| Status       | Draft           |
| Owner        | Dius Montenegro |
| Version      | 0.1             |
| Last Updated | November 5, 2026 |

---

## Implementation Status

Implemented:

- Next.js foundation, dark-only landing page, Clerk authentication, protected Discover and Watch routes, paginated video feeds, playback, persistent dashboard playback, dashboard theme switching, dedicated AI chat, conversational video search, and device-local video preference ranking.
- Responsive, branded Clerk sign-in and sign-up surfaces with authenticated-user redirects to Discover.
- Mobile-first responsive dashboard and authentication layouts using viewport-safe sizing.
- Protected dashboard navigation uses explicit RSC fetch behavior to avoid stale prefetched payload failures during local development and authenticated transitions.

Not implemented yet:

- Final public SEO metadata, automated Playwright coverage, release validation, and deployment verification.

Live provider journeys and Vercel deployment require browser and environment verification before launch.

---

# 1. Overview

## Product Name

PHANTASM YT AI

## Type

Web Application

## One-Line Description

A YouTube-style web application with integrated AI chat powered by OpenRouter.

## Problem

Create a personal project that combines a modern YouTube-inspired experience with AI-powered assistance.

## Solution

Users can sign up, sign in, browse and play videos, ask AI questions, switch between AI models, and use a conversational AI search assistant.

## Why Now / Why Us

Personal learning, experimentation, and portfolio project focused on modern AI and web technologies.

---

# 2. Goals and Non-Goals

## Goals

1. Implement authentication using Clerk.
2. Provide a landing page with Sign In and Sign Up.
3. Provide a protected dashboard after authentication.
4. Display a YouTube-inspired interface with playable videos.
5. Integrate AI chat powered by OpenRouter.
6. Allow users to switch between AI models.
7. Provide conversational AI search with follow-up support.
8. Preserve active video playback while navigating authenticated dashboard routes.
9. Provide device-local video ranking based on searches and viewing activity.

## Non-Goals

1. Database integration.
2. Video uploads.
3. Payments and subscriptions.
4. Docker support.
5. Multi-user collaboration.
6. CMS integration.

---

# 3. Users

## Primary User

Authenticated user.

Authentication and user management are handled through Clerk.

---

# 4. Success Metrics

| Metric                 | Target     |
| ---------------------- | ---------- |
| Sign Up Works          | Functional |
| Sign In Works          | Functional |
| Logout Works           | Functional |
| Protected Routes Work  | Functional |
| Video Playback Works   | Functional |
| AI Chat Responds       | Functional |
| Model Switching Works  | Functional |
| AI Search Works        | Functional |
| Lighthouse Performance | 90+        |

---

# 5. Positioning, Brand, and Tone

## Tagline

Watch. Search. Chat.

## Positioning

For users who want a YouTube-like experience enhanced with AI assistance.

## Tone of Voice

- Simple
- Modern
- Premium
- Technical
- Friendly

## Existing Brand Assets

None

---

# 6. User Actions

## Primary Actions

- Browse videos
- Play videos
- Chat with AI
- Search using AI

## Secondary Actions

- Sign Up
- Sign In
- Logout
- Switch AI models
- Toggle dashboard theme

---

# 7. User Journeys

## Authentication Journey

1. User lands on homepage.
2. User clicks Sign In or Sign Up.
3. Clerk authenticates the user.
4. User is redirected to the dashboard.

### Success Criteria

Authenticated users can access protected pages. Authenticated visits to the landing, sign-in, and sign-up routes redirect directly to the dashboard.

---

## Watch Videos Journey

1. User accesses dashboard.
2. User sees a YouTube-style feed.
3. User selects a video.
4. Video plays successfully.

### Success Criteria

Video playback starts without errors. Watch is separate from Discover; selecting a video opens its player route and a compact persistent player remains available during dashboard navigation.

---

## AI Chat Journey

1. User opens the dedicated AI chat workspace.
2. User opens the dedicated AI chat workspace and asks a general question.
3. Prompt is sent to OpenRouter.
4. AI returns a response.

### Success Criteria

The answer appears progressively in the chat interface. AI chat is for asking questions and does not perform video discovery or display search results.

---

## AI Model Switching Journey

1. User opens model selector.
2. User selects a model.
3. Future prompts use the selected model.

### Success Criteria

Selected model powers future responses.

---

## AI Search Journey

1. User opens the AI search chatbot.
2. User enters a natural-language search request.
3. The AI interprets the request and returns relevant video results.
4. User can ask follow-up questions in the same conversation.
5. Follow-up requests refine or clarify the results.

### Success Criteria

Relevant video search results are returned in the conversational AI interface, including a clear state when no results are found. Follow-up messages refine the existing search.

## Personalized Discovery Journey

1. User searches for videos or views videos in the application.
2. Relevant activity is stored in browser local storage on that device.
3. Discover candidates are ranked using channel, title-term, and viewed-video preferences.
4. Watch remains trending-oriented and does not use the same local ranking.

### Success Criteria

Recommendations reflect activity stored on that device while candidate videos still come from the configured provider. Refreshing the page resets persistent playback rather than restoring stale playback state.

---

# 8. Functional Requirements

| ID    | Requirement                   | Priority | Acceptance Criteria                                                                   |
| ----- | ----------------------------- | -------- | ------------------------------------------------------------------------------------- |
| FR-01 | User authentication via Clerk | M        | Given valid credentials, when user signs in, then dashboard is accessible             |
| FR-02 | User logout                   | M        | Given authenticated user, when logout is clicked, then session is terminated          |
| FR-03 | Route protection              | M        | Given unauthenticated user, when accessing dashboard, then redirect to authentication |
| FR-04 | Video feed UI                 | M        | Dashboard displays video cards                                                        |
| FR-05 | Video playback                | M        | Clicking a video starts playback                                                      |
| FR-06 | AI chat workspace             | M        | Dedicated workspace handles general questions and conversational video search |
| FR-07 | OpenRouter integration        | M        | Messages are processed by OpenRouter                                                  |
| FR-08 | Model selector                | M        | User can select a model and use it for future prompts                                 |
| FR-09 | AI search chatbot             | M        | User can search conversationally and continue with follow-up questions                 |
| FR-10 | Dashboard dark and light themes | S      | Dashboard theme switching works; the public landing page remains dark-only |
| FR-11 | Responsive design             | S        | Layout works on mobile and desktop                                                    |
| FR-12 | Discover and Watch routes     | M        | Discover recommendations and the dedicated Watch feed are available on separate routes |
| FR-13 | Persistent video playback     | S        | Active playback follows dashboard navigation and can be closed in compact mode |
| FR-14 | Infinite video scrolling      | M        | Additional provider pages load near the feed boundary |
| FR-15 | Device-local personalization  | S        | Discover rankings are influenced by local searches and video viewing activity |

---

# 9. Information Architecture

## Routes

| Route        | Purpose          | Public | Auth Required |
| ------------ | ---------------- | ------ | ------------- |
| `/`          | Landing Page     | Yes    | No            |
| `/sign-in`   | Sign In          | Yes    | No            |
| `/sign-up`   | Sign Up          | Yes    | No            |
| `/dashboard` | Discover | No | Yes |
| `/dashboard/watch` | Watch feed | No | Yes |
| `/dashboard/watch/[videoId]` | Video player | No | Yes |
| `/dashboard/chat` | PHANTASM AI workspace | No | Yes |
| `/api/chat` | AI chat and conversational search | No | Yes |
| `/api/videos` | Paginated video provider endpoint | No | Yes |

## Navigation

### Public

- Home
- Sign In
- Sign Up

### Authenticated

- Dashboard
- Discover
- Watch
- AI Chat
- Model Selector
- Logout

## Dashboard Sections

1. Header
2. Sidebar Navigation
3. Video Feed
4. Video Player
5. Persistent Mini Player
6. AI Chat Workspace
7. Model Selector

---

# 10. Content

## Landing Page

### Hero

"Watch videos and interact with AI in one experience."

### Primary CTA

- Sign Up

### Secondary CTA

- Sign In

## Dashboard

### Video Feed

Displays available videos.

### AI Chat

Provides general question-and-answer assistance in the dedicated `/dashboard/chat` workspace.

### AI Search Chatbot

Uses the same dedicated PHANTASM AI workspace. It interprets natural-language requests, returns relevant video results, and supports follow-up questions that refine the conversation.

---

# 11. Design Direction

## Visual Style

- Apple-inspired
- Glassmorphism
- Modern SaaS
- Clean and minimal
- Premium UI

## Typography

- Poppins
- Inter

## Theme

- Public landing page: dark-only
- Dashboard light
- Dashboard dark
- Dashboard system preference when no saved choice exists
- System

## Responsive Behavior

- Mobile layouts are designed at 390px first and checked at 320px, 768px, 1280px, and desktop widths.
- Touch targets are at least 44px.
- Body text remains readable at a minimum of 16px.
- Viewport-height layouts use `dvh`.
- Layouts avoid fixed widths and horizontal overflow at 320px.

## References

- YouTube
- Next.js
- Vercel

---

# 12. Technical Decisions

| Area           | Needed | Provider / Notes         |
| -------------- | ------ | ------------------------ |
| Framework      | Yes    | Next.js App Router       |
| Language       | Yes    | TypeScript               |
| Styling        | Yes    | Tailwind CSS + shadcn/ui |
| Database       | No     | Not required for MVP     |
| Authentication | Yes    | Clerk                    |
| Payments       | No     | Not required             |
| AI Features    | Yes    | OpenRouter               |
| CMS            | No     | Not required             |
| Email          | No     | Not required             |
| File Storage   | No     | Not required             |
| Analytics      | No     | Not required             |
| Multi-Tenant   | No     | Not required             |
| Video provider | Yes    | RapidAPI YouTube v31     |
| Infinite data  | Yes    | TanStack React Query     |
| Persistence    | Yes    | Browser local/session storage |

## Application Architecture Decisions

- `/dashboard` is Discover.
- `/dashboard/watch` is the dedicated Watch feed.
- `/dashboard/watch/[videoId]` is the primary video player route.
- A dashboard-level mini player preserves playback while navigating between dashboard routes.
- Full-page reloads intentionally clear remembered playback.
- Server Components fetch initial provider data where practical.
- `/api/videos` supplies authenticated, paginated feeds for infinite scrolling.
- Device preferences are stored in `localStorage` under `phantasm-video-preferences`.
- Discover rotates Philippines-focused queries in session storage and applies local ranking after hydration.
- Watch remains trending-oriented and is not locally re-ranked.
- Official YouTube APIs do not expose YouTube's private homepage algorithm. PHANTASM therefore ranks provider candidates using device-local activity.
- Provider failures are surfaced with sanitized browser messages; provider credentials and raw response bodies are not exposed.
- Clerk sign-in and sign-up use the application's branded dark auth treatment, and authenticated visits redirect to `/dashboard`.
- Dashboard links do not eagerly prefetch protected RSC payloads; navigation fetches the destination route when selected to avoid stale payload failures.

## OpenRouter Models

### Default Model

```text
nvidia/nemotron-3-ultra-550b-a55b:free
```

### Available Models

```text
nvidia/nemotron-3-ultra-550b-a55b:free
nvidia/nemotron-3.5-super-vl:free
dots-studio/dots-3-note-preview:free
```

### Model Behavior

- Default: Nemotron 3 Ultra
- User-selectable via UI
- Automatic fallback supported

## Environment Variables

Configured through existing `.env` file.

---

# 13. Data Model

Not required for MVP.

No database will be used.

---

# 14. Non-Functional Requirements

## Performance

- Lighthouse Score ≥ 90
- LCP ≤ 2.5s

## Accessibility

- WCAG 2.2 AA

## Security

- Clerk authentication
- Secrets stored in environment variables
- API keys never exposed client-side

## Browser Support

- Chrome
- Edge
- Firefox
- Safari

## Localization

English only

---

# 15. Testing Requirements

## Critical E2E Journeys

1. Sign Up
2. Sign In
3. Logout
4. Protected Dashboard Access
5. Video Playback
6. AI Chat
7. Model Switching
8. Theme Switching
9. Discover and Watch navigation
10. Persistent video playback
11. Infinite scrolling
12. Device-local recommendation updates

## Mandatory Tests

- Auth guards
- Protected routes
- OpenRouter integration
- Model selector behavior

---

# 16. Deployment and Operations

## Target

Vercel

## Environments

- Development
- Preview
- Production

## Monitoring

- Vercel Analytics

## Domain

TBD

---

# 17. Existing Assets and Code

## Repo

TBD

## Brand Assets

None

## Constraints

- Clerk must be used
- OpenRouter must be used
- Existing `.env` file should be reused

---

# 18. Assumptions, Risks, and Open Questions

| Type          | Item                                                | Owner | Status |
| ------------- | --------------------------------------------------- | ----- | ------ |
| Assumption    | OpenRouter free models remain available             | Owner | Open   |
| Assumption    | Clerk free tier is sufficient                       | Owner | Open   |
| Risk          | Free model rate limits                              | Owner | Open   |
| Risk          | Search capabilities may require future enhancements | Owner | Open   |
| Open Question | Source of video content                             | Owner | Open   |

---

# 19. Launch Criteria

The product can go live when:

- [ ] Clerk authentication works
- [ ] Protected routes work
- [ ] Video feed renders successfully
- [ ] Video playback works
- [ ] Question-only OpenRouter chat works
- [ ] Model selector works
- [ ] Conversational AI search works with follow-up questions
- [ ] Production build succeeds
- [ ] Vercel deployment succeeds

---

# 20. Change Log

| Date          | Change                 | Reason                 |
| ------------- | ---------------------- | ---------------------- |
| November 2026 | Initial MVP definition | Project initialization |
| November 2026 | Added implementation status | Document completed and remaining work |
| November 2026 | Unified AI Chat and AI Search | One dedicated workspace handles general questions and conversational video discovery |
| November 2026 | Separated Discover, Watch, and AI routes | Added route-specific navigation and playback behavior |
| November 2026 | Added persistent playback | Preserved active video navigation with session-local refresh reset |
| November 2026 | Added device-local Discover ranking | Added Philippines rotation and local preference ranking |
| November 5, 2026 | Updated authentication and responsive layouts | Added branded Clerk auth surfaces and mobile-first dashboard/auth behavior |
| November 5, 2026 | Stabilized protected dashboard navigation | Disabled eager protected-route prefetch to prevent stale RSC payload fetch failures |
