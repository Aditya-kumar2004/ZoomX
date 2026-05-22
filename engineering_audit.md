# 🔍 ZoomX — Complete Engineering Audit

> **Reviewer Role:** Senior Fullstack Engineer · Software Architect · Project Auditor · Technical Interview Evaluator
> **Stack:** Next.js 15 · TypeScript · Tailwind CSS · Django 6 · DRF · SQLite
> **Audit Date:** May 2026

---

## 1. PROJECT OVERVIEW

ZoomX is a Zoom-clone video conferencing web platform. The project has a clear separation of frontend and backend, uses modern tooling, and demonstrates a solid understanding of fullstack architecture. It is a **portfolio/internship-level project** with a genuine, premium UI and partially functional backend.

**The good news:** The project is significantly more complete and professional than an average student project.
**The hard truth:** Several critical engineering gaps would cause concern in a real interview — particularly around authentication security, real-time communication (the core of any Zoom clone), and data integrity.

---

## 2. ARCHITECTURE REVIEW

### Overall Architecture
```
Frontend (Next.js 15 App Router)
        ↕ REST API (HTTP, no tokens)
Backend (Django + DRF)
        ↕ ORM
Database (SQLite)
```

### What's Correct ✅
- Clean separation of frontend and backend into separate directories
- App Router (`src/app/`) is correctly used
- `src/components/`, `src/hooks/`, `src/services/`, `src/context/`, `src/types/`, `src/utils/` — all properly separated
- Django apps split by domain: `meetings/` and `zoom_auth/` — correct Django architecture
- `providers.tsx` correctly wraps the app with `QueryClientProvider`, `GoogleOAuthProvider`, `AuthProvider`, and `Toaster`
- DRF `@api_view` decorators are used correctly for function-based views

### Critical Architectural Gaps ❌

#### 1. NO Real-Time Communication — The Biggest Missing Piece
A Zoom clone **fundamentally requires** WebRTC (peer-to-peer video/audio) and WebSockets (signaling). Your backend has no WebSocket support at all. The current meeting room UI is essentially a **beautiful mockup** — the video tiles show local camera but there is no actual peer-to-peer connection to other users. This is the #1 thing an interviewer will ask about.

#### 2. NO Token-Based Authentication
The backend uses Django's session-based `login()`, but the frontend uses plain `fetch()` with no cookies, no JWT, no bearer token. The auth flow is completely broken for API calls — any protected endpoint would be unauthenticated. You are storing user data in `localStorage` (client-side only) but sending zero auth credentials to the backend with API requests.

#### 3. Hardcoded `localhost` in the Model
```python
# meetings/models.py line 46
self.invite_link = "http://localhost:3000/meeting/" + self.meeting_id
```
Business logic is hardcoded with a development URL inside the model. This is a very bad practice that will break the moment you deploy.

#### 4. `CORS_ALLOW_ALL_ORIGINS = True` defeats CORS
You set specific origins AND then allow all origins — the specific setting is pointless and this is insecure.

---

## 3. FRONTEND REVIEW

### 3.1 Next.js Structure & App Router — ✅ Good
- App Router is used correctly with `src/app/` structure
- `"use client"` directives are placed only where needed
- Layout nesting is implemented properly (`layout.tsx` → `DashboardLayout` → pages)
- Dynamic routing: `/meeting/[id]/page.tsx` — correct naming and convention

**Issue:** `dashboard/page.tsx` has `"use client"` at the top, but it doesn't need to be — it simply assembles server-renderable components. Making it a server component and passing data through props would be better practice.

### 3.2 Component Architecture — ✅ Very Good
Component hierarchy is clean and well thought out:
- `DashboardLayout` wraps `Navbar` + `Sidebar` + `main`
- `ActionGrid`, `UpcomingMeetings`, `RecentMeetings`, `DateTimeDisplay` are properly separated single-responsibility components
- Meeting room: `VideoGrid` → `VideoTile`, `ControlBar`, `ParticipantPanel`, `ChatPanel` — excellent decomposition

**Issue:** The `VideoGrid` component is outstanding engineering (implements the same tile-area optimization algorithm used by Google Meet using `ResizeObserver`). However, it shows **fake participants** hardcoded at line 285–288 in `meeting/[id]/page.tsx`:
```typescript
{ id: "alex", name: "Alex Morgan", cameraOff: true },
{ id: "jamie", name: "Jamie Chen", muted: true },
{ id: "sam", name: "Sam Rivera" },
```
These are mock participants with no actual video streams — in an interview, this will immediately be identified as not being a real video conferencing app.

### 3.3 State Management — ⚠️ Partially Correct
- `AuthContext` + `useAuth` hook pattern is correct
- `useMeetings` hook is a good abstraction for data fetching
- `localStorage` for user state is **not production-correct** — use `httpOnly` cookies
- `TanStack Query` (`QueryClient`) is installed in providers but **never actually used** for any query — all data fetching uses `useEffect` + `useState` manually. This is inconsistent and wastes the library.

### 3.4 API Integration — ⚠️ Partially Done
The `services/api.ts` file is well-structured with a typed generic `request<T>()` helper. But:
- No authentication headers are sent with requests
- `data: any` typed parameters in `authAPI.register()`, `authAPI.login()` — use proper types
- Mock data fallback is production-committed with `// TODO` comment still present

### 3.5 TypeScript Usage — ✅ Good (with minor issues)
- Interfaces in `types/index.ts` match backend serializer output exactly — very good
- `forwardRef` used correctly in `ZButton`
- `ZButton` has properly typed `ButtonHTMLAttributes<HTMLButtonElement>` extension
- **Issues:**
  - `data: any` in `authAPI` methods defeats TypeScript's purpose
  - `(e as Error & { status?: number })` type assertion is repeated in multiple files — should be a named type
  - Missing `meeting_type` in the `Meeting` type interface

### 3.6 Custom Hooks — ✅ Good
- `useAuth` / `useRequireAuth` — clean separation
- `useMeetings` — proper loading/error/data pattern
- `useClipboard` — small, reusable
- `use-mobile.tsx` — correct responsive hook
- **Issue:** `useRequireAuth` redirects but doesn't return `null` to prevent the guarded component from rendering before redirect completes. `DashboardLayout` handles this with a loader, which is correct, but the hook itself could be cleaner.

### 3.7 Performance Practices — ✅ Good
- `useCallback` is used in `useMeetings` for `fetchAll`
- `ResizeObserver` is properly cleaned up in `VideoGrid`
- `AnimatePresence` is used for exit animations
- `Promise.all` for parallel API calls in `useMeetings`
- **Issue:** The live clock in `Navbar` creates a `setInterval` every render of the component. There's also a duplicate clock in `DateTimeDisplay.tsx` — two `setInterval` instances running simultaneously.

### 3.8 Routing — ✅ Good
- `/`, `/auth/signin`, `/auth/register`, `/dashboard`, `/dashboard/recordings`, `/dashboard/settings`, `/meeting/[id]`, `/schedule` — all implemented
- Sidebar hash-based scroll navigation (`#upcoming`, `#recent`) — creative but not ideal with App Router (SPA scroll)

---

## 4. BACKEND REVIEW

### 4.1 Django Architecture — ⚠️ Acceptable for a student project, missing key layers
- No `serializers.py` in `zoom_auth` (it uses Django's built-in User model directly)
- No `services.py` layer — business logic lives directly in views
- No `permissions.py` or custom permission classes
- No middleware for auth token verification
- No signals used

### 4.2 `meetings/views.py` — Function-Based Views
All 6 endpoints use `@api_view` decorator style — this is acceptable for a simple project but a professional codebase would use class-based views (CBVs) or `ViewSets` with a `Router` for standard CRUD.

**`create_meeting` (API 1):**
```python
meeting = Meeting.objects.create(title="Instant Meeting", meeting_type="instant")
```
- ✅ Correct pattern
- ❌ No user association — who created this meeting? There's no `host` or `created_by` field on the `Meeting` model

**`get_meeting` (API 2):** ✅ Clean, correct `try/except DoesNotExist` pattern

**`join_meeting` (API 3):**
- ❌ No check if meeting is `is_active = True`
- ❌ No user deduplication — the same person can join infinite times, creating infinite `Participant` rows
- ❌ No check for meeting capacity

**`schedule_meeting` (API 4):**
- ❌ No input validation — `scheduled_time` is accepted as a raw string with no validation that it's a valid future datetime
- ❌ No `title` length validation
- ❌ No user association

**`upcoming_meetings` (API 5):**
- ✅ Correct filter with `timezone.now()`
- ❌ Returns ALL meetings for ALL users — completely ignores auth. In a real system, you'd filter by the requesting user's meetings.

**`recent_meetings` (API 6):**
- ❌ Returns ALL meetings globally — again, no user filtering

### 4.3 `zoom_auth/views.py` — Authentication Views

**`register_user`:**
- ✅ Correct OTP flow: create inactive user → generate OTP → send email → return
- ✅ Background threading for email sending — good UX thinking
- ❌ `random.randint()` for OTP generation — should use `secrets.randbelow()` (cryptographically secure)
- ❌ No rate limiting — an attacker can spam the endpoint to create thousands of accounts
- ❌ HTML email template is 126 lines inside the view — this belongs in a template file
- ❌ Username collision fix via suffix loop is fragile and can theoretically loop for a long time

**`verify_otp`:**
- ✅ OTP expiry check with `is_expired()` — correct
- ✅ Deletes OTP record after use — correct
- ❌ The `login(request, user)` call is Django session-based auth — but the frontend never sends session cookies. This call does nothing useful.

**`login_user`:**
- ✅ Correctly looks up user by email, then authenticates by username
- ❌ Same session problem — `login(request, user)` is useless for an SPA

**`google_login`:**
- ✅ Dual handling of ID token vs access token — sophisticated
- ✅ `get_or_create` pattern for upsert — correct
- ❌ Same session problem
- ❌ The username suffix loop can create weird race conditions

### 4.4 Missing: Token Authentication
The entire auth system is built on Django sessions but the frontend uses stateless `fetch()`. You need **JWT** (`djangorestframework-simplejwt`) or DRF **Token Authentication**. Without this, no API endpoint is actually authenticated.

### 4.5 `meetings/models.py` — Models
```python
class Meeting(models.Model):
    meeting_id = models.CharField(max_length=20, unique=True)
    ...
```

**Issues:**
- `meeting_id` is `CharField(max_length=20)` but UUID v4 first 8 chars are used — this is fine but not standard
- No `ForeignKey` to `User` (host) — fundamental missing relationship
- `invite_link` is stored in the database with hardcoded localhost — should be derived/computed, not stored
- `meeting_type` is a plain `CharField` with no choices validation — use `choices=` parameter
- No index on `scheduled_time` — the `upcoming_meetings` filter query will do a full table scan
- `Participant` has no link to `User` — anonymous participants only

### 4.6 `zoom_auth/models.py` — OTP Model
```python
class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
```
- ✅ Simple and correct
- ❌ OTP is stored as plaintext — should be hashed
- ❌ No attempt counter — a 6-digit OTP can be brute-forced with 1 million attempts if there's no lockout

### 4.7 Error Handling — ⚠️ Inconsistent
- `meetings/views.py` returns `{"error": "..."}` consistently ✅
- `zoom_auth/views.py` returns `{"error": "..."}` and `{"message": "..."}` — inconsistent
- No global exception handler for unexpected server errors — Django will return HTML 500 instead of JSON

---

## 5. DATABASE REVIEW

### Schema Overview
```
Meeting          Participant       OTPVerification       User (Django Built-in)
---------        -----------       ---------------       ----------------------
id (PK)          id (PK)           id (PK)               id (PK)
meeting_id       meeting_id (FK)   email (unique)        username
title            display_name      otp                   email
description      joined_at         created_at            first_name
meeting_type                                             is_active
invite_link                                             ...
scheduled_time
duration
created_at
is_active
```

### Issues

| Issue | Severity |
|---|---|
| No `host` FK from Meeting → User | 🔴 Critical |
| No User FK from Participant → User | 🟠 High |
| `invite_link` stored in DB (derived data) | 🟡 Medium |
| `meeting_type` has no `choices` enforcement | 🟡 Medium |
| No index on `scheduled_time` | 🟡 Medium |
| OTP stored in plaintext | 🔴 Critical |
| No `ended_at` timestamp on Meeting | 🟡 Medium |
| No normalization of `display_name` | 🟢 Low |

### Normalization Level: 2NF (Partial)
The schema is mostly 2NF but missing important relationships. It cannot answer "Who are the meetings of user X?" because meetings have no host. This is a fundamental database design flaw for any multi-user system.

### SQLite for Development: ✅ Acceptable
SQLite is fine for development and a portfolio project. However, be prepared to explain migration to PostgreSQL for production.

---

## 6. API REVIEW

### Endpoint Inventory

| Method | Endpoint | Status |
|---|---|---|
| POST | `/api/meetings/create/` | ✅ Works (no auth) |
| POST | `/api/meetings/schedule/` | ✅ Works (no validation) |
| GET | `/api/meetings/upcoming/` | ⚠️ No user filtering |
| GET | `/api/meetings/recent/` | ⚠️ No user filtering |
| GET | `/api/meetings/<id>/` | ✅ Works |
| POST | `/api/meetings/<id>/join/` | ⚠️ No deduplication |
| POST | `/api/auth/register/` | ✅ Works |
| POST | `/api/auth/verify-otp/` | ✅ Works |
| POST | `/api/auth/login/` | ✅ Works (session only) |
| POST | `/api/auth/google/` | ✅ Works (session only) |

### REST Compliance Issues
- No PATCH/PUT/DELETE for meetings — no update or delete functionality
- Endpoint naming is mostly correct, but `/api/meetings/create/` should just be `POST /api/meetings/` (RESTful resource creation)
- `/api/meetings/<id>/join/` — using a nested action is acceptable (this is like DRF Router `@action`)
- No API versioning (`/api/v1/...`)
- No pagination on list endpoints

### Response Structure — Inconsistent
```json
// Auth success:
{"message": "Login successful", "user": {...}}

// Meeting success:  
{...meeting fields directly...}

// Error:
{"error": "..."}
```
A professional API uses a consistent envelope: `{"success": true, "data": {...}}` or `{"success": false, "error": {...}}` — not mixing flat responses with nested ones.

---

## 7. UI/UX REVIEW

### Design Quality: ⭐⭐⭐⭐½ (4.5/5) — Outstanding for a student project

**What works brilliantly:**
- Dark theme (`#08090A`, `#111118`, `#1A1A26`) is polished and professional
- Consistent color system: `#2D6FFF` (primary blue), `#7B5CFF` (purple accent), `#FF3B55` (danger red), `#00C566` (success green)
- `Geist` + `DM Sans` font pairing is excellent — very modern
- Framer Motion animations throughout — `motion.button` in `ActionGrid`, `AnimatePresence` in modals and reactions, scale/opacity in VideoGrid
- The meeting room ControlBar is Zoom-like in layout and functionality
- Reaction system with floating emoji animations — delightful UX detail
- Meeting card design with pulse dot, copy link, participant count badge — premium quality
- Collapsible sidebar with smooth `300ms` transition — professional

**Issues:**
- Sidebar is `hidden md:flex` — completely invisible on mobile. There's no hamburger menu or mobile drawer. The entire dashboard is inaccessible on phones.
- The Navbar `Search` and `Bell` buttons are non-functional (no search feature, no notifications system)
- `Starred` in the sidebar has no corresponding page or functionality
- The `Share Screen` action card shows `toast.info("This feature opens in a meeting room")` — it navigates nowhere
- Meeting card's `Trash2` delete button has **no `onClick` handler** — it's purely cosmetic

---

## 8. FILE-BY-FILE REVIEW

### BACKEND

#### `ZoomX/settings.py`
- **What it does:** Django project configuration
- **Issues:**
  - `SECRET_KEY` is hardcoded in source code — critical security issue. Must use `os.environ.get('SECRET_KEY')`
  - `DEBUG = True` hardcoded — must be `DEBUG = os.environ.get('DEBUG', 'False') == 'True'`
  - `ALLOWED_HOSTS = []` — must be configured
  - `CORS_ALLOW_ALL_ORIGINS = True` defeats the purpose of `CORS_ALLOWED_ORIGINS`
  - No `REST_FRAMEWORK` configuration block — DRF defaults are used, including no authentication classes
  - No `DEFAULT_AUTO_FIELD` setting (though Django 6 may handle this)
  - Good: `dotenv` is used, email settings are environment-driven

#### `ZoomX/urls.py`
- **What it does:** Root URL routing
- Clean and correct. Only 8 lines. Proper use of `include()`.
- No API versioning prefix (`api/v1/`)

#### `meetings/models.py`
- **What it does:** Defines `Meeting` and `Participant` models
- Covered in detail in Section 5. Main issues: no User FK, hardcoded localhost in save(), no choices for meeting_type.

#### `meetings/serializers.py`
- **What it does:** Serializes Meeting and Participant for API responses
- ✅ `participant_count` as `SerializerMethodField` — correct pattern
- ✅ Nested `ParticipantSerializer` in `MeetingSerializer` — correct
- Missing `meeting_type` is exposed, but with no validation

#### `meetings/views.py`
- **What it does:** 6 API view functions for meeting CRUD
- Well-organized with section comments. Clean, readable code.
- Lacks input validation (use DRF Serializers for write operations)
- No authentication requirement on any endpoint

#### `meetings/urls.py`
- **What it does:** URL patterns for meetings app
- Clean. The ordering `<str:meeting_id>/` before `<str:meeting_id>/join/` is correct.

#### `zoom_auth/models.py`
- **What it does:** OTP verification record
- Simple and focused. `is_expired()` method is clean.
- OTP is stored plaintext — security issue.

#### `zoom_auth/views.py`
- **What it does:** Registration, OTP verification, login, Google login
- Most complex backend file (354 lines). The threading for email is clever.
- 126 lines of inline HTML email template — move to `templates/email/otp.html`
- The `import requests` and `import os` at line 275-278 mid-file is poor style — all imports should be at the top
- No serializer layer for request validation

#### `requirements.txt`
- **Critical Issue:** Contains plaintext credentials in comments:
  ```
  # Username: adi   
  # Email address: adityakuma876@gmail.com
  # Password: adi12345
  # Client ID: 902405653902-...
  # Client secret: GOCSPX-...
  ```
  **This is a serious security mistake.** These credentials should never be committed to version control, especially in plain text.

### FRONTEND

#### `src/app/layout.tsx`
- **What it does:** Root layout with fonts, metadata, providers
- ✅ `suppressHydrationWarning` on `<html>` and `<body>` — correct (browser extension hydration fix)
- ✅ Google font variables set correctly
- ✅ OpenGraph/Twitter metadata — SEO aware

#### `src/app/page.tsx` (48KB)
- **What it does:** Landing page with all sections
- At 48KB / ~1400 lines, this is by far the largest file in the project
- The landing page is comprehensive: Hero, Brands, Features, Stats, HowItWorks, Testimonials, CTA, FAQ
- **Critical Issue:** The entire landing page is a single monolithic file. Every section should be its own component in `src/components/landing/`
- Good animations with Framer Motion throughout

#### `src/app/auth/signin/page.tsx`
- **What it does:** Sign in form with email/password and Google OAuth
- ✅ `react-hook-form` for form management — correct
- ✅ OTP verification flow handled inline — good UX
- ✅ `useGoogleLogin` hook from `@react-oauth/google` — correct integration
- ✅ Error state display, loading states, password toggle — complete

#### `src/app/auth/register/page.tsx`
- (Not read but inferred) — Mirror of signin with registration flow

#### `src/app/dashboard/page.tsx`
- **What it does:** Main dashboard page
- Very clean — 35 lines. Excellent separation of concerns.
- Should remove `"use client"` and render as Server Component

#### `src/app/meeting/[id]/page.tsx`
- **What it does:** Meeting room — the core feature
- Most complex frontend file (421 lines)
- ✅ `useRequireAuth()` guard — correct
- ✅ Real `navigator.mediaDevices.getUserMedia()` with preferred device IDs from settings — sophisticated
- ✅ `MediaRecorder` API for local recording to `IndexedDB` — impressive feature
- ✅ Screen sharing via `getDisplayMedia` with auto-stop detection — well implemented
- ✅ Reaction system with floating animations — delightful
- ❌ Mock participants hardcoded (lines 285-288) — no real WebRTC peers
- ❌ 7 separate `useEffect` hooks in one component — needs extraction to custom hooks
- ❌ The component is doing too much — media management, recording, screen share, reactions, timer, data fetching — violates SRP

#### `src/components/layout/DashboardLayout.tsx`
- **What it does:** Authenticated layout wrapper
- ✅ `useRequireAuth()` + `isAuthenticated` guard with loader — correct auth protection
- 21 lines — clean and minimal

#### `src/components/layout/Navbar.tsx`
- **What it does:** Top navigation bar
- ✅ Live clock with `setInterval` — nice UX detail
- ✅ User avatar with initials from `getInitials()` — clean
- ⚠️ Search and Bell buttons are non-functional
- ⚠️ Dropdown menu has no click-outside-to-close behavior

#### `src/components/layout/Sidebar.tsx`
- **What it does:** Navigation sidebar with collapse
- ✅ Collapsible with smooth transition — professional
- ✅ Active state detection with `usePathname()`
- ✅ User info at bottom of sidebar
- ❌ `hidden md:flex` — completely missing on mobile, no mobile nav alternative

#### `src/components/dashboard/ActionGrid.tsx`
- **What it does:** 4 quick-action cards (New Meeting, Join, Schedule, Share)
- ✅ Framer Motion stagger animation on cards
- ✅ Join Meeting modal with ID + name validation
- ✅ Fallback demo meeting if API fails
- ❌ "Share Screen" is a dead feature in the dashboard context

#### `src/components/dashboard/MeetingCard.tsx`
- **What it does:** Reusable card for both upcoming and recent meetings
- ✅ `variant` prop for conditional rendering (upcoming vs recent) — proper pattern
- ✅ `date-fns` for formatting — `format` vs `formatDistanceToNow` based on variant
- ❌ Delete button (Trash2) has no `onClick` handler — dead UI element

#### `src/components/meeting/VideoGrid.tsx`
- **What it does:** Responsive video tile grid with screen share layout
- ✅ `computeOptimalCols` — genuine algorithm matching Google Meet's approach
- ✅ `ResizeObserver` for responsive column calculation
- ✅ Screen share layout with scrollable participant strip
- This is the most sophisticated component in the entire project

#### `src/components/meeting/ControlBar.tsx`
- **What it does:** Bottom meeting controls
- ✅ Proper prop interface definition
- ✅ Emoji reaction picker with AnimatePresence
- ✅ Leave confirmation modal
- ✅ Meeting ID display with copy functionality
- ✅ Elapsed timer display

#### `src/components/ui/ZButton.tsx`
- **What it does:** Design system Button component
- ✅ `forwardRef` — correct for a reusable component
- ✅ Variant + Size maps using Record<> types
- ✅ Proper disabled + loading states
- ✅ `ButtonHTMLAttributes` extension for full HTML attribute pass-through
- This is production-quality component design

#### `src/components/ui/ZModal.tsx`
- **What it does:** Animated modal dialog
- ✅ Escape key close handler
- ✅ Backdrop click to close with `stopPropagation` on modal content
- ✅ `AnimatePresence` for mount/unmount animation
- Missing `role="dialog"` and `aria-modal="true"` — accessibility gap

#### `src/services/api.ts`
- **What it does:** Centralized API layer
- ✅ Generic `request<T>()` with typed responses
- ✅ Structured error extraction with status code attachment
- ❌ `BASE_URL` hardcoded as `http://127.0.0.1:8000/api` — should be `process.env.NEXT_PUBLIC_API_URL`
- ❌ No auth headers in requests
- ❌ `data: any` in auth methods
- ❌ Mock data with `// TODO: Remove` comment still in production-committed code

#### `src/context/AuthContext.tsx`
- **What it does:** Auth state with localStorage persistence
- ✅ `ready` state prevents flash of unauthenticated content
- ✅ Clean `login` / `logout` functions
- ❌ User state from `localStorage` is not verified against the server — anyone can craft a fake user object in localStorage and bypass the UI auth guard
- ❌ No token refresh mechanism

#### `src/hooks/useAuth.ts`
- **What it does:** Hook to consume AuthContext
- ✅ Error thrown if used outside provider — defensive
- ✅ `useRequireAuth` as a redirect-on-unauthenticated pattern

#### `src/hooks/useMeetings.ts`
- **What it does:** Data fetching hook for meetings
- ✅ `Promise.all` for parallel requests
- ✅ `useCallback` to prevent `useEffect` re-running
- ✅ Mock fallback when API fails — good DX
- ❌ `TanStack Query` is installed but not used here — inconsistent

#### `src/types/index.ts`
- **What it does:** TypeScript interfaces matching backend
- Clean and concise. Missing `meeting_type` field.

#### `src/utils/helpers.ts`
- **What it does:** Pure utility functions
- ✅ `getInitials`, `avatarGradient`, `parseMeetingId`, `formatDuration` — all well-implemented pure functions
- `avatarGradient` uses a simple hash — consistent deterministic coloring

#### `src/utils/indexedDB.ts`
- **What it does:** IndexedDB wrapper for local recording storage
- ✅ Promise-based API wrapping the callback-based IndexedDB
- ✅ SSR guard (`typeof window === "undefined"`)
- ✅ Version management with `onupgradeneeded`
- This is sophisticated browser API usage — most students never touch IndexedDB

#### `src/styles.css`
- **What it does:** Global CSS with design tokens and utilities
- Custom CSS utilities like `.glow-blue`, `.btn-glow`, `.card-base`, `.underline-slide`, `.bg-dot-grid`
- This is good — design tokens in CSS rather than scattered inline classes

---

## 9. FEATURE COMPLETION CHECKLIST

| Feature | Status | Notes |
|---|---|---|
| Landing Page | ✅ Fully Complete | Premium, multi-section |
| User Registration | ✅ Fully Complete | OTP email flow works |
| User Login | ✅ Fully Complete | Email/password + Google |
| Google OAuth | ✅ Fully Complete | Both ID token and access token |
| Dashboard | ✅ Fully Complete | Layout, cards, actions |
| New Meeting (Instant) | ✅ Functionally Complete | API connected, demo fallback |
| Join Meeting | ⚠️ Partially Complete | API call works but no real P2P |
| Schedule Meeting | ✅ Functionally Complete | API connected |
| Upcoming Meetings | ✅ Functionally Complete | Displays correctly |
| Recent Meetings | ✅ Functionally Complete | Displays correctly |
| Meeting Room UI | ✅ Fully Complete | Impressive UI |
| Real Video Conferencing (WebRTC) | ❌ Missing | Critical gap |
| Local Camera/Mic | ✅ Fully Complete | getUserMedia with device preference |
| Screen Sharing | ✅ Fully Complete | getDisplayMedia working |
| Emoji Reactions | ✅ Fully Complete | Floating animation |
| In-Meeting Chat | ⚠️ UI Only | ChatPanel renders, no real messages |
| Meeting Recording (Local) | ✅ Fully Complete | MediaRecorder → IndexedDB |
| Recordings Dashboard | ✅ Functionally Complete | Lists and plays recordings |
| Settings Page | ✅ Functionally Complete | Device preferences saved to localStorage |
| Invite Link Copy | ✅ Fully Complete | |
| Delete Meeting | ❌ Missing | Trash icon has no handler |
| API Authentication | ❌ Missing | No JWT/token system |
| User-Scoped Meetings | ❌ Missing | Meetings are global, not per-user |
| Mobile Responsive | ⚠️ Partially Complete | Landing responsive, dashboard not mobile |
| Notifications | ❌ Missing | Bell icon is decorative |
| Starred Meetings | ❌ Missing | Sidebar item has no page |

---

## 10. BUGS & ISSUES

### 🔴 Critical (Fix Before Showing to Anyone)

1. **Credentials in `requirements.txt`:** Gmail password, Google OAuth client secret, and admin credentials are committed in plain text. This is a security disaster.

2. **`SECRET_KEY` hardcoded in `settings.py`:** Django's secret key is exposed in source code. Rotate it immediately.

3. **No auth on any API endpoint:** All meeting endpoints are completely public. Anyone can create, join, or view all meetings without logging in.

4. **Session auth doesn't work with SPA:** The `login(request, user)` calls do nothing because the frontend doesn't send session cookies.

### 🟠 High (Fix Before Interview)

5. **Mock participants hardcoded in meeting room:** The video conference shows fake participants instead of real WebRTC peers.

6. **Invite link hardcoded to `localhost`:** Production will have wrong links.

7. **`data: any` in auth API service:** TypeScript safety defeated.

8. **No mobile sidebar:** Dashboard is broken on mobile.

9. **Delete button has no handler:** Obvious broken UI.

10. **Duplicate clock intervals:** `Navbar` and `DateTimeDisplay` both run a 1-second `setInterval`.

### 🟡 Medium (Improve for Code Quality)

11. **`CORS_ALLOW_ALL_ORIGINS = True` overrides the specific origins setting.**

12. **`import requests` and `import os` mid-file** in `zoom_auth/views.py` (line 275-278).

13. **`TanStack Query` installed but unused** — all data fetching is manual useEffect.

14. **Landing page is 48KB single file** — needs component extraction.

15. **`page.tsx` meeting room has 7 `useEffect` hooks** — needs custom hook extraction.

16. **OTP not hashed in database.**

17. **No rate limiting on auth endpoints.**

18. **`meeting_type` field has no `choices` enforcement in the model.**

---

## 11. SCALABILITY REVIEW

| Concern | Current | Recommended |
|---|---|---|
| Database | SQLite (single file) | PostgreSQL with connection pooling |
| Authentication | Session-based (broken) | JWT with refresh tokens |
| Real-time | None | WebRTC + WebSocket signaling (Django Channels) |
| File Storage | IndexedDB (browser local) | S3/GCS for recordings |
| API Design | Flat functions | ViewSets + Routers |
| Meetings → User | No relationship | ForeignKey + filtering |
| Email | Threading (unsafe) | Celery + Redis task queue |
| CORS | `ALLOW_ALL_ORIGINS = True` | Specific origins per environment |
| Environment Config | `.env` (partially) | Fully environment-driven settings |

---

## 12. INTERVIEW READINESS

### ✅ Can This Pass an Internship Evaluation?
**Yes, for frontend/UI-focused roles.** The UI is genuinely impressive and shows real engineering thinking (VideoGrid algorithm, IndexedDB recording, MediaRecorder, ResizeObserver). For a backend or fullstack role, the lack of real authentication and WebRTC will be noticed.

### 👍 What Interviewers Will Like
1. The VideoGrid tile optimization algorithm — this shows you researched how Google Meet works
2. IndexedDB recording with MediaRecorder — advanced browser API usage
3. Screen sharing with auto-stop detection
4. The OTP email flow — async threading, HTML email template
5. Google OAuth dual-token handling (ID token vs access token)
6. The custom `ZButton` with `forwardRef`, variants, and `ButtonHTMLAttributes` extension
7. `parseMeetingId` utility — handles URL input gracefully
8. Premium UI/UX — this is far above average

### 👎 What Interviewers Will Criticize
1. **"Where is WebRTC?"** — This is the core of a Zoom clone
2. **"How does authentication actually work end-to-end?"** — It doesn't
3. **"Credentials in requirements.txt"** — Immediate red flag
4. **"Who owns these meetings? How do I see only my meetings?"** — No user relationship
5. **"TanStack Query is in the providers but never used — why?"**
6. **"The delete button does nothing"**
7. **"How would you make this work on mobile?"**

### ❓ Questions Interviewers Will Ask
1. "Explain the authentication flow from registration to making an authenticated API request."
2. "How would you implement real video conferencing using WebRTC?"
3. "Why did you use localStorage for auth instead of httpOnly cookies?"
4. "Walk me through the VideoGrid algorithm. What is the time complexity?"
5. "How would you scale this to 100 concurrent meetings?"
6. "What would you change if you had to use PostgreSQL instead of SQLite?"
7. "How does screen sharing work in your code? Walk me through `toggleShare`."
8. "The `useMeetings` hook falls back to mock data silently — is this a good pattern for production?"
9. "Your API has no versioning. How would you add it?"
10. "How would the recording feature work in a multi-participant meeting?"

### 📁 Files You Must Understand Deeply
1. `src/app/meeting/[id]/page.tsx` — Core feature, most complex
2. `src/components/meeting/VideoGrid.tsx` — Best engineering in the project
3. `src/services/api.ts` — API integration layer
4. `src/context/AuthContext.tsx` + `src/hooks/useAuth.ts` — Auth system
5. `zoom_auth/views.py` — Most complex backend file
6. `meetings/models.py` — Database design decisions
7. `src/utils/indexedDB.ts` — Advanced browser API

---

## 13. FINAL COMPLETION PERCENTAGES

| Area | Completion | Notes |
|---|---|---|
| **Frontend (UI)** | **88%** | Excellent UI, missing mobile nav, a few dead buttons |
| **Frontend (Logic)** | **70%** | Auth works client-side, no real WS/WebRTC |
| **Backend (Auth)** | **65%** | Flows work but sessions don't connect to SPA |
| **Backend (Meetings)** | **50%** | CRUD exists but no user scoping, no auth |
| **Database** | **55%** | Models exist but missing key relationships |
| **API Design** | **60%** | Functional but inconsistent, no auth headers |
| **UI/UX** | **85%** | Premium desktop, poor mobile |
| **Real-time Features** | **10%** | Local camera/mic only, no P2P |
| **Security** | **20%** | Multiple critical vulnerabilities |
| **Overall Project** | **~62%** | |

---

## 14. PRIORITY FIX LIST

### 🔴 Do First (Before any demo or interview)
1. **Remove credentials from `requirements.txt`** — rotate all exposed secrets
2. **Move `SECRET_KEY` to `.env`** — `SECRET_KEY = os.environ.get('SECRET_KEY')`
3. **Implement JWT authentication** — install `djangorestframework-simplejwt`, add `Authorization: Bearer <token>` header to all frontend requests
4. **Add a `host` ForeignKey to `Meeting`** — link to `User`
5. **Filter upcoming/recent meetings by the authenticated user**

### 🟠 Do Second (For a polished demo)
6. **Add a mobile sidebar** — hamburger menu + drawer
7. **Fix the delete button** — add `onClick` and a DELETE API endpoint
8. **Move mock data to a dev-only flag** — `if (process.env.NODE_ENV === 'development')`
9. **Move `BASE_URL` to `process.env.NEXT_PUBLIC_API_URL`**
10. **Add `meeting_type` choices to the model**

### 🟡 Do Third (For code quality / interview questions)
11. **Extract media management from meeting page into `useMediaStream` custom hook**
12. **Extract recording logic into `useRecording` custom hook**
13. **Break `page.tsx` landing page into section components**
14. **Actually use TanStack Query** — replace `useEffect`-based fetching in `useMeetings`
15. **Add global error handler in Django for JSON 500 responses**
16. **Hash OTP before storing**
17. **Add `db_index=True` to `Meeting.scheduled_time`**

---

## 15. FINAL ENGINEERING VERDICT

### ⭐⭐⭐⭐ (4/5 stars for a student/internship project)

**What this project demonstrates:**
- A genuine understanding of fullstack architecture
- Production-quality component design (`ZButton`, `VideoGrid`, `ZModal`)
- Sophisticated browser API usage (WebRTC/MediaDevices, IndexedDB, ResizeObserver, MediaRecorder)
- Real-world engineering thinking (OTP email flow, Google OAuth, background threading)
- Premium design sensibility with consistent design tokens, Framer Motion, dark theme

**What this project lacks:**
- The actual core functionality of a Zoom clone: WebRTC peer-to-peer video
- A working end-to-end authentication system connecting backend sessions to frontend requests
- User-scoped data (meetings belong to users)
- Mobile responsiveness for the dashboard
- Basic security practices (secret management)

**Bottom line for interviews:**
> This project will impress any interviewer for its UI polish, component architecture, and advanced browser API usage. It will raise serious red flags for its security practices (credentials in files), broken authentication pipeline, and the absence of actual video conferencing. Know the gaps cold. Be ready to explain what WebRTC is, why you'd use Django Channels for signaling, and why JWT is better than sessions for an SPA. If you can explain the VideoGrid algorithm and the IndexedDB recording system in detail, you will stand out.

> **Verdict: Strong foundation, interview-ready with caveats. Fix the security issues immediately. Add JWT auth as your next feature. Study WebRTC for the follow-up questions.**
