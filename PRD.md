# PRD - PHANTASM YT AI

> **Purpose:** This document defines WHAT is being built and WHY. It serves as the single source of truth for the MVP.

| Field        | Value           |
| ------------ | --------------- |
| Status       | Draft           |
| Owner        | Dius Montenegro |
| Version      | 0.1             |
| Last Updated | November 2026   |

---

## Implementation Status

Implemented:

- Next.js foundation, landing page, Clerk authentication, protected dashboard, video search/feed/player, theme toggle, and question-only streamed AI chat.

Not implemented yet:

- Conversational AI Search with follow-up messages and video results.
- Final theme, responsive, accessibility, SEO, automated-test, release, and deployment work.

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
- Toggle theme

---

# 7. User Journeys

## Authentication Journey

1. User lands on homepage.
2. User clicks Sign In or Sign Up.
3. Clerk authenticates the user.
4. User is redirected to the dashboard.

### Success Criteria

Authenticated users can access protected pages.

---

## Watch Videos Journey

1. User accesses dashboard.
2. User sees a YouTube-style feed.
3. User selects a video.
4. Video plays successfully.

### Success Criteria

Video playback starts without errors.

---

## AI Chat Journey

1. User opens the AI chat widget.
2. User asks a general question.
3. Prompt is sent to OpenRouter.
4. AI returns a response.

### Success Criteria

The answer appears in the chat interface. AI chat is for asking questions and does not perform video discovery or display search results.

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

Relevant video search results are returned in the conversational AI search interface, including a clear state when no results are found.

---

# 8. Functional Requirements

| ID    | Requirement                   | Priority | Acceptance Criteria                                                                   |
| ----- | ----------------------------- | -------- | ------------------------------------------------------------------------------------- |
| FR-01 | User authentication via Clerk | M        | Given valid credentials, when user signs in, then dashboard is accessible             |
| FR-02 | User logout                   | M        | Given authenticated user, when logout is clicked, then session is terminated          |
| FR-03 | Route protection              | M        | Given unauthenticated user, when accessing dashboard, then redirect to authentication |
| FR-04 | Video feed UI                 | M        | Dashboard displays video cards                                                        |
| FR-05 | Video playback                | M        | Clicking a video starts playback                                                      |
| FR-06 | AI chat widget                | M        | User can ask questions and receive text responses without video-search behavior       |
| FR-07 | OpenRouter integration        | M        | Messages are processed by OpenRouter                                                  |
| FR-08 | Model selector                | M        | User can select a model and use it for future prompts                                 |
| FR-09 | AI search chatbot             | M        | User can search conversationally and continue with follow-up questions                 |
| FR-10 | Dark and light themes         | S        | Theme switching works                                                                 |
| FR-11 | Responsive design             | S        | Layout works on mobile and desktop                                                    |

---

# 9. Information Architecture

## Routes

| Route        | Purpose          | Public | Auth Required |
| ------------ | ---------------- | ------ | ------------- |
| `/`          | Landing Page     | Yes    | No            |
| `/sign-in`   | Sign In          | Yes    | No            |
| `/sign-up`   | Sign Up          | Yes    | No            |
| `/dashboard` | Main Application | No     | Yes           |
| `/api/chat`  | Streaming question-only AI chat | No | Yes |

## Navigation

### Public

- Home
- Sign In
- Sign Up

### Authenticated

- Dashboard
- AI Chat
- Model Selector
- Logout

## Dashboard Sections

1. Header
2. Sidebar Navigation
3. Video Feed
4. Video Player
5. AI Chat Widget
6. Model Selector

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

Provides question-and-answer assistance only. It does not perform video search or show video results.

### AI Search Chatbot

Provides a separate conversational search experience. It interprets natural-language requests, returns relevant video results, and supports follow-up questions that refine the conversation.

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

- Light
- Dark
- System

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
| November 2026 | Separated AI Chat and AI Search | Define AI Chat as question-only and AI Search as conversational video discovery |
