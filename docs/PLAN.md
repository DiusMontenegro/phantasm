# PHANTASM YT AI - MVP Delivery Plan

## Status

Implementation order is sequential. Complete and validate one step before starting the next step.

### Current progress

- [x] Step 1: Next.js foundation
- [x] Step 2: Environment contract
- [x] Step 3: Clerk authentication and route protection
- [x] Step 4: Public landing page
- [x] Step 5: Dashboard shell
- [x] Step 6: Video feed and playback
- [x] Step 7: Server-side OpenRouter chat service
- [x] Step 8: General-purpose AI chat widget and model selector
- [x] Step 9: Unified AI chat and conversational video search
- [x] Step 10: Themes, responsiveness, and accessibility completion
- [ ] Step 11: SEO and public metadata
- [ ] Step 12: Automated validation
- [ ] Step 13: Release validation
- [ ] Step 14: Deployment configuration
- [ ] Step 15: Deployment and verification

### Confirmed implementation decisions

- The dashboard is dark-first; the theme toggle persists the user's light/dark preference.
- The public landing page is permanently dark-only and is independent of dashboard theme state.
- Theme state initializes deterministically to avoid server/client hydration mismatches.
- Video discovery uses server-side RapidAPI integration and privacy-enhanced YouTube embeds.
- AI Chat is a dedicated question-and-answer workspace at `/dashboard/chat` and must never perform video discovery.
- AI Search is a separate conversational experience with follow-up support and will return video results.
- OpenRouter API calls and API keys remain server-side.
- `/dashboard` is Discover and `/dashboard/watch` is the dedicated Watch feed.
- Video pagination uses authenticated `/api/videos` requests with TanStack React Query.
- Persistent playback is dashboard-level; full-page reloads intentionally clear remembered playback.
- Mini-player dismissal is session-local and exposes a close control outside the active player route.
- Discover rotates Philippines-focused queries and applies device-local ranking after hydration.
- Watch remains trending-oriented and is not locally re-ranked.
- Device preferences use `localStorage`; playback and discovery rotation use `sessionStorage`.
- PHANTASM recommendations rank provider candidates using local activity, not the private YouTube homepage algorithm.
- Provider failures are sanitized before reaching browser clients.
- Clerk sign-in and sign-up use branded dark auth surfaces and redirect authenticated users to `/dashboard`.
- Authenticated dashboard navigation does not eagerly prefetch protected RSC payloads, preventing stale RSC fetch failures during auth or development-server transitions.
- Mobile-first responsive work starts at 390px and validates 320px, 768px, 1280px, and wider layouts without fixed-width overflow.

## Steps

### 1. Initialize and verify the Next.js foundation

- Confirm the approved Next.js and TypeScript project structure against the repository instructions.
- Install and configure the approved dependencies with npm.
- Configure strict TypeScript, Tailwind CSS, scripts, and linting.
- Add the application-level loading and error states required by the repository guide.
- Verify the project starts and passes its initial type and lint checks.

### 2. Create the environment contract

- Define and validate all required environment variables in `lib/env.ts`.
- Configure Clerk publishable and secret variables.
- Configure a server-only RapidAPI key for YouTube video data.
- Configure the server-only OpenRouter API key and default model.
- Provide safe placeholder documentation in `.env.example` without real secrets.
- Confirm that browser-accessible variables use only the `NEXT_PUBLIC_` prefix.

### 3. Configure Clerk authentication and route protection

- Configure Clerk for App Router according to the installed Next.js version.
- Add the sign-in and sign-up routes.
- Add server-side Clerk session checks and protected route middleware or proxy.
- Configure redirects for unauthenticated dashboard access and authenticated sign-in flows.
- Add logout behavior.
- Verify sign-up, sign-in, logout, protected access, and redirect journeys.

### 4. Build the public landing page

- Create the public landing page at `/`.
- Implement Sign In and Sign Up calls to action.
- Apply the approved Apple-inspired, premium, responsive visual system.
- Keep the public landing page permanently dark-only and do not add a landing-page theme toggle.
- Add public-page metadata, loading state, and error handling.
- Verify desktop and mobile layouts.

### 5. Build the protected dashboard shell

- Create the authenticated dashboard at `/dashboard`.
- Implement the responsive header, navigation, theme control, and main content layout.
- Add a server-side authentication boundary.
- Add loading and empty states.
- Verify authentication and non-authenticated access behavior.

### 6. Implement the YouTube-style video feed

- Create the video feature structure under `features/videos`.
- Connect video discovery to the server-side RapidAPI integration.
- Render a responsive video card grid.
- Implement video selection and playable video viewing.
- Add loading, error, and empty states.
- Verify video rendering and playback.

### 7. Implement server-side OpenRouter chat

- Create the server OpenRouter service under `server/openrouter`.
- Keep AI chat limited to question-and-answer behavior; it must not perform video discovery.
- Validate prompts and environment configuration.
- Add the chat API boundary.
- Implement streaming responses so the response appears progressively.
- Ensure the OpenRouter API key never reaches client code.
- Add loading and error handling.
- Verify chat responses through the dashboard.

### 8. Build the AI chat widget and model selector

- Create the chat feature under `features/chat`.
- Add accessible message input, history, submit, retry, and streaming states.
- Add the approved model selector.
- Use `nvidia/nemotron-3-ultra-550b-a55b:free` as the default model.
- Permit only the optional models listed by the repository guide.
- Verify model switching and continued chat behavior.

### 9. Implement AI search

- Create the search feature under `features/search`.
- Build AI search as a dedicated conversational experience in the unified AI workspace, separate from general question answering.
- Connect natural-language search requests to the server-side AI and video discovery services.
- Support follow-up messages that refine or clarify an existing search conversation.
- Display video results conversationally within the AI search interface.
- Add loading, error, and empty states.
- Validate prompt handling and search result rendering.

### 10. Complete themes, responsiveness, and accessibility

- Implement light, dark, and system themes for authenticated dashboard surfaces only.
- Build mobile layouts at 390px first, using `dvh` for viewport-height surfaces and maintaining 44px touch targets and readable body text.
- Prevent fixed-width layouts and horizontal overflow at 320px.
- Ensure theme state is accessible and persists appropriately.
- Validate layouts at 320px, 768px, 1024px, and 1440px.
- Add keyboard navigation, visible focus states, accessible labels, and semantic markup.
- Verify color contrast and responsive behavior.

### 11. Add SEO and public metadata

- Add metadata for the landing, sign-in, and sign-up pages.
- Mark private dashboard content with noindex where supported.
- Add `sitemap.ts` and `robots.ts`.
- Verify that only approved public pages are indexed as intended.

### 12. Add automated validation

- Add Playwright coverage for sign-up, sign-in, logout, dashboard access, video playback, chat, model switching, theme switching, and AI search.
- Add focused unit or integration tests for environment validation and server services where the existing test setup supports them.
- Verify tests fail for the expected cases and pass for complete journeys.

### 13. Run release validation

- Run `npx tsc --noEmit`.
- Run the configured lint command.
- Run the available unit and integration tests.
- Run the Playwright end-to-end suite.
- Run the production build.
- Resolve all release-blocking failures.
- Record the exact validation commands and actual results.

### 14. Prepare deployment configuration

- Confirm deployment is targeted only to Vercel.
- Confirm the project is linked to a Vercel project before relying on any project-specific configuration; do not fabricate a deployment URL or project ID.
- Configure these Production, Preview, and Development environment variables:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `RAPIDAPI_KEY`
  - `OPENROUTER_API_KEY`
- Configure Clerk allowed origins, sign-in URL, sign-up URL, and post-authentication redirect URL for each verified deployed domain.
- Add Vercel deployment configuration only if the installed framework requires repository-specific settings.

### 15. Deploy and verify

- Deploy the validated application to Vercel Preview.
- Verify public landing, sign-in, and sign-up pages.
- Verify Clerk callbacks and protected dashboard redirects.
- Verify video data and playback.
- Verify OpenRouter chat and streaming.
- Verify model switching, AI search, themes, and responsive layout.
- Promote the verified build to Production.
- Run a final production smoke test and record the actual deployed URLs.
