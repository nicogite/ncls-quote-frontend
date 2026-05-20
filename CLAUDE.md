# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # vue-tsc type-check + vite build
npm run lint         # ESLint --fix
npm run format       # Prettier
npm run test:unit    # Vitest
```

## Architecture

This is the **admin backoffice** — not the user-facing app (that is `quote-mobile`).

**Stack**: Vue 3 + Vuetify 3 (UI components) + Quill 2 (rich text editor for static content).

**Auth**: JWT stored in the Pinia auth store (`src/store/auth.ts`). The router guard in `src/router/index.ts` checks `auth.isAuthenticated()` before entering any `/admin/*` route and redirects to `/admin/login`.

**Routes**:
- `/admin/login` — public, guest-only (redirects to `/admin` if already authenticated)
- `/admin` → `DashboardView` (stats)
- `/admin/quotes` → `QuotesView` (CRUD on quotes, paginated)
- `/admin/content` → `ContentView` (edit `static_content` rows with Quill)

The public-facing pages (`/bienvenue`, `/votre-citation`, etc.) are legacy routes — the actual user app is `quote-mobile`. These views are not actively maintained.

## API

All admin API calls go to `/api/admin/*` with a `Authorization: Bearer <token>` header. The base URL is set from `VITE_API_URL` in the env file (same variable as `quote-mobile`).

## Quill / rich text

`ContentView` uses Quill to edit the `value` field of `static_content` rows. The saved HTML is rendered via `v-html` in the mobile app (`IntroView`, `WelcomeView`). Keep the HTML clean — avoid inline styles that conflict with Ionic's CSS variables, and avoid `<script>` tags. Content is admin-only so XSS risk is low, but still write clean markup.
