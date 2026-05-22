<div align="center">

![ZoomX Banner](./zoomx_readme_banner.png)

<br/>

# ZoomX — Enterprise Video Conferencing Platform

**Production-grade, browser-native video conferencing powered by WebRTC, Django Channels, and Next.js 16**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Django](https://img.shields.io/badge/Django-6.0.5-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com)
[![WebRTC](https://img.shields.io/badge/WebRTC-Native-FF6B35?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> *Zero-download, zero-plugin, crystal-clear video meetings — directly in the browser.*

<br/>

[🚀 Live Demo](#-quick-start) · [📖 Docs](#-api-reference) · [🐛 Issues](../../issues) · [💬 Discussions](../../discussions)

---

</div>

<br/>

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup-django)
  - [Frontend Setup](#frontend-setup-nextjs)
- [🔐 Environment Variables](#-environment-variables)
- [🌐 API Reference](#-api-reference)
- [🔌 WebSocket Protocol](#-websocket-protocol)
- [🎨 Pages & Routes](#-pages--routes)
- [🧩 Component Library](#-component-library)
- [🔒 Security](#-security)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎥 Live Meeting Engine
- **Native WebRTC** — peer-to-peer video & audio, no plugins, no downloads
- **Dynamic Video Grid** — auto-resizes tiles as participants join or leave
- **Screen Sharing** — full-tab or application window sharing with native controls
- **Local Recording** — capture meetings offline using MediaRecorder API, saved to IndexedDB
- **Real-time Chat** — WebSocket-powered instant messaging with sender avatars and email badges

</td>
<td width="50%">

### 🛡️ Host Moderation Tools
- **Secure Waiting Room** — guests wait in a lobby; host admits individually or all at once
- **Mute / Unmute Participants** — host can remotely control any guest's microphone
- **Camera Control** — host can turn off any participant's video
- **Kick Participants** — instantly remove disruptive attendees
- **End Meeting for All** — single-click to terminate the session for every participant

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Authentication System
- **Email + Password** registration with OTP email verification
- **Google OAuth 2.0 SSO** — one-click sign-in via Google
- **JWT Access Tokens** — stateless, secure, auto-refresh
- **Gravatar Integration** — automatic profile pictures from email hash

</td>
<td width="50%">

### 🎨 Premium UI / UX
- **Glassmorphic Design System** — frosted-glass panels with depth and blur
- **Framer Motion Animations** — 60fps micro-interactions on every element
- **Emoji Reactions** — animated floating reaction bubbles during meetings
- **Meeting Ended Screen** — auto-countdown redirect with premium glassmorphic overlay
- **Full Responsive Layout** — optimized for desktop and mobile

</td>
</tr>
</table>

---

<br/>

## 🏗️ Architecture

![Architecture Diagram](./zoomx_arch_diagram.png)

<br/>

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
│                                                                     │
│  ┌──────────────────┐    WebRTC P2P     ┌──────────────────────┐   │
│  │   Peer A (You)   │◄────────────────►│   Peer B (Remote)    │   │
│  │  Camera / Mic    │                  │  Camera / Mic        │   │
│  └────────┬─────────┘                  └──────────────────────┘   │
│           │                                                          │
│           │  WebSocket Signaling                                     │
└───────────┼──────────────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────────┐
│                    BACKEND (Django + Channels)                     │
│                                                                    │
│  ┌─────────────┐   ┌──────────────────────┐   ┌──────────────┐   │
│  │   Daphne    │   │  Django Channels WS  │   │  REST APIs   │   │
│  │  ASGI Server│──►│  MeetingConsumer     │   │  Auth/Mtg    │   │
│  └─────────────┘   │  - join / offer      │   └──────┬───────┘   │
│                    │  - answer / ICE      │          │            │
│                    │  - chat / control    │          ▼            │
│                    └──────────────────────┘   ┌──────────────┐   │
│                                               │   SQLite DB  │   │
│                                               │  (Meetings,  │   │
│                                               │  Users, OTP) │   │
│                                               └──────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

**Signaling Flow:**
1. Browser connects via WebSocket → `ws://localhost:8000/ws/meeting/<id>/`
2. Peer A sends `join` → server broadcasts `peer_joined` to room
3. Peer A sends `offer` (SDP) → server routes to Peer B
4. Peer B sends `answer` → server routes back to Peer A
5. Both exchange `ice_candidate` messages to establish P2P tunnel
6. Audio/video streams flow **directly between browsers** — never through the server

---

<br/>

## 🗂️ Project Structure

```
Scaler/
├── 📁 Frontend/
│   └── 📁 zoomx-connect/               # Next.js 16 Application
│       ├── 📁 src/
│       │   ├── 📁 app/                  # Next.js App Router Pages
│       │   │   ├── 📄 page.tsx          # Landing / Marketing Home
│       │   │   ├── 📁 auth/            # Register & Sign-In pages
│       │   │   ├── 📁 dashboard/       # User dashboard (meetings, recordings, settings)
│       │   │   ├── 📁 meeting/[id]/    # 🔴 LIVE Meeting Room (dynamic route)
│       │   │   ├── 📁 join/            # Guest join page
│       │   │   ├── 📁 blog/            # Blog page
│       │   │   ├── 📁 about/           # About page
│       │   │   ├── 📁 careers/         # Careers page
│       │   │   ├── 📁 changelog/       # Changelog page
│       │   │   ├── 📁 contact/         # Contact page
│       │   │   ├── 📁 docs/            # Docs page
│       │   │   ├── 📁 help/            # Help center page
│       │   │   ├── 📁 press/           # Press page
│       │   │   ├── 📁 schedule/        # Meeting scheduling page
│       │   │   ├── 📁 security/        # Security page
│       │   │   └── 📁 status/          # System status page
│       │   │
│       │   ├── 📁 components/
│       │   │   ├── 📁 meeting/         # 🎥 Core Meeting Components
│       │   │   │   ├── 📄 VideoGrid.tsx        # Dynamic participant video grid
│       │   │   │   ├── 📄 VideoTile.tsx        # Individual video tile with overlay
│       │   │   │   ├── 📄 ControlBar.tsx       # Meeting control bar (mic, camera, share)
│       │   │   │   ├── 📄 ParticipantPanel.tsx # Participants list + host moderation
│       │   │   │   ├── 📄 ChatPanel.tsx        # Real-time chat with avatars
│       │   │   │   └── 📄 EmojiReaction.tsx    # Floating emoji animation
│       │   │   ├── 📁 dashboard/       # Dashboard-specific components
│       │   │   ├── 📁 layout/          # LandingLayout, DashboardLayout, Navbar
│       │   │   └── 📁 ui/              # Reusable UI primitives (ZButton, ZBadge, etc.)
│       │   │
│       │   ├── 📁 hooks/
│       │   │   ├── 📄 useWebRTC.ts     # 🔌 Main WebRTC + WebSocket signaling hook
│       │   │   ├── 📄 useAuth.ts       # Auth state from JWT context
│       │   │   ├── 📄 useMeetings.ts   # Meeting CRUD hook
│       │   │   └── 📄 useClipboard.ts  # Clipboard utility hook
│       │   │
│       │   ├── 📁 services/
│       │   │   └── 📄 api.ts           # Axios client + all REST API calls
│       │   │
│       │   ├── 📁 context/
│       │   │   └── 📄 AuthContext.tsx  # Global JWT auth context provider
│       │   │
│       │   ├── 📁 types/
│       │   │   └── 📄 index.ts         # Shared TypeScript types & interfaces
│       │   │
│       │   └── 📁 utils/
│       │       ├── 📄 indexedDB.ts     # Local recording storage (IndexedDB)
│       │       └── 📄 helpers.ts       # Format helpers (duration, date, etc.)
│       │
│       ├── 📄 package.json
│       ├── 📄 tsconfig.json
│       ├── 📄 next.config.mjs
│       └── 📄 .env.local
│
└── 📁 backend/
    └── 📁 ZoomX/                       # Django 6 Project
        ├── 📁 ZoomX/                   # Project config module
        │   ├── 📄 settings.py          # Django settings (CORS, Channels, JWT)
        │   ├── 📄 urls.py              # Root URL configuration
        │   ├── 📄 asgi.py              # ASGI config for WebSocket support
        │   └── 📄 wsgi.py              # WSGI config
        │
        ├── 📁 meetings/                # Meeting Management App
        │   ├── 📄 models.py            # Meeting & Participant models
        │   ├── 📄 views.py             # Meeting CRUD REST endpoints
        │   ├── 📄 serializers.py       # DRF serializers
        │   ├── 📄 consumers.py         # 🔌 Django Channels WebSocket consumer
        │   ├── 📄 routing.py           # WebSocket URL routing
        │   └── 📄 urls.py              # HTTP REST URL routing
        │
        ├── 📁 zoom_auth/               # Authentication App
        │   ├── 📄 models.py            # OTPVerification model
        │   ├── 📄 views.py             # Register, Login, OTP, Google SSO, Profile
        │   └── 📄 urls.py              # Auth URL routing
        │
        ├── 📄 manage.py
        ├── 📄 requirements.txt
        ├── 📄 db.sqlite3               # SQLite database (dev only)
        └── 📄 .env                     # Backend environment variables
```

---

<br/>

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 16.2.6 | App Router, SSR, Dynamic Routes |
| **UI Library** | React | 19.2.0 | Component rendering |
| **Language** | TypeScript | 5.8 | Type safety throughout |
| **Styling** | TailwindCSS | 4.2.1 | Utility-first CSS |
| **Animations** | Framer Motion | 12.x | Page transitions & micro-animations |
| **Icons** | Lucide React | 0.575 | Crisp SVG icon set |
| **WebRTC** | Browser Native API | — | Peer-to-peer video/audio |
| **Signaling** | WebSocket (native) | — | Real-time peer coordination |
| **Auth** | Google OAuth | @react-oauth/google | One-click SSO |
| **State** | React Context + useState | — | Auth and meeting state |
| **Forms** | React Hook Form + Zod | 7.x / 3.x | Validated form inputs |
| **Notifications** | Sonner | 2.x | Toast notifications |
| **Recording** | MediaRecorder API | — | In-browser video recording |
| **Storage** | IndexedDB | Native | Local recording persistence |
| **Data Fetching** | TanStack Query | 5.x | Async API state management |
| **Component Primitives** | Radix UI | 1.x | Accessible UI headless components |
| **Formatting** | Prettier | 3.x | Code formatting |
| **Linting** | ESLint | 9.x | Code quality |

### Backend

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Django | 6.0.5 | Core web framework |
| **API** | Django REST Framework | 3.17.1 | REST endpoint generation |
| **WebSockets** | Django Channels | 4.0.0 | Async WebSocket support |
| **ASGI Server** | Daphne | 4.0.0 | Production ASGI server |
| **Auth / JWT** | DRF SimpleJWT | 5.3.1 | Stateless JWT token auth |
| **JWT Decoding** | PyJWT | 2.13 | Token validation |
| **Google Auth** | google-auth | — | ID token verification for SSO |
| **CORS** | django-cors-headers | 4.9 | Cross-origin header management |
| **Database** | SQLite (dev) / PostgreSQL (prod) | — | Data persistence |
| **Environment** | python-dotenv | — | `.env` configuration loading |
| **HTTP Client** | requests | — | Outbound HTTP (OAuth flows) |

---

<br/>

## ⚡ Quick Start

### Prerequisites

Make sure you have the following installed:

```
Node.js    >= 20.x
npm        >= 10.x
Python     >= 3.11
pip        >= 23.x
Git
```

---

### Backend Setup (Django)

```bash
# 1. Navigate to the backend directory
cd Scaler/backend/ZoomX

# 2. Create and activate a Python virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# 3. Install all Python dependencies
pip install -r requirements.txt

# 4. Create and configure your .env file (see Environment Variables)
cp .env.example .env

# 5. Apply database migrations
python manage.py makemigrations
python manage.py migrate

# 6. (Optional) Create a superuser for Django admin
python manage.py createsuperuser

# 7. Start the Daphne ASGI server (supports both HTTP and WebSocket)
daphne -p 8000 ZoomX.asgi:application

# ✅ Backend is live at http://localhost:8000
```

> **Note:** Daphne handles both HTTP REST requests and WebSocket connections simultaneously via ASGI.

---

### Frontend Setup (Next.js)

```bash
# 1. Navigate to the frontend directory
cd Scaler/Frontend/zoomx-connect

# 2. Install Node.js dependencies
npm install

# 3. Create and configure your .env.local file (see Environment Variables)
cp .env.local.example .env.local

# 4. Start the Next.js development server
npm run dev

# ✅ Frontend is live at http://localhost:3000
```

**Other useful commands:**

```bash
npm run build          # Create an optimized production build
npm run start          # Serve the production build
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npx tsc --noEmit       # Type-check without building
```

---

<br/>

## 🔐 Environment Variables

### Frontend — `.env.local`

```env
# Django Backend Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Google OAuth Client ID (from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Backend — `.env`

```env
# Django Secret Key (generate a new one for production)
SECRET_KEY=your-very-long-random-secret-key-here

# Debug mode (set to False in production)
DEBUG=True

# Allowed hosts (comma-separated for production)
ALLOWED_HOSTS=localhost,127.0.0.1

# Frontend URL (used for generating meeting invite links)
FRONTEND_URL=http://localhost:3000

# Google OAuth Client ID (must match frontend)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email configuration (for OTP verification emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True

# Database (leave empty to use default SQLite in development)
DATABASE_URL=postgres://user:password@host:5432/dbname
```

---

<br/>

## 🌐 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register/` | Register a new user (triggers OTP email) | ❌ |
| `POST` | `/auth/verify-otp/` | Verify OTP and activate account | ❌ |
| `POST` | `/auth/login/` | Login with email + password → returns JWT | ❌ |
| `POST` | `/auth/google/` | Authenticate with Google ID token → returns JWT | ❌ |
| `POST` | `/auth/refresh/` | Refresh JWT access token | ❌ |
| `GET` | `/auth/profile/` | Get the current authenticated user's profile | ✅ JWT |
| `PUT` | `/auth/profile/` | Update user profile (name, avatar) | ✅ JWT |

### Meeting Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/meetings/` | List all meetings for the current user | ✅ JWT |
| `POST` | `/meetings/` | Create a new meeting (instant or scheduled) | ✅ JWT |
| `GET` | `/meetings/<meeting_id>/` | Get meeting details by meeting ID | ✅ JWT |
| `PUT` | `/meetings/<meeting_id>/` | Update meeting details | ✅ JWT |
| `DELETE` | `/meetings/<meeting_id>/` | Delete a meeting | ✅ JWT |

### Request / Response Examples

**POST `/auth/register/`**
```json
// Request
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}

// Response 201
{
  "message": "OTP sent to jane@example.com. Please verify to activate your account."
}
```

**POST `/meetings/`**
```json
// Request
{
  "title": "Product Review Q2",
  "meeting_type": "scheduled",
  "scheduled_time": "2026-06-01T10:00:00Z",
  "duration": 60
}

// Response 201
{
  "id": 1,
  "meeting_id": "a3f8c2d1",
  "title": "Product Review Q2",
  "invite_link": "http://localhost:3000/meeting/a3f8c2d1",
  "host_email": "jane@example.com",
  "meeting_type": "scheduled",
  "scheduled_time": "2026-06-01T10:00:00Z",
  "duration": 60,
  "is_active": true,
  "created_at": "2026-05-22T09:00:00Z"
}
```

---

<br/>

## 🔌 WebSocket Protocol

ZoomX uses a **custom control-message protocol** over WebSockets, layered on top of standard WebRTC signaling.

**Connection:**
```
ws://localhost:8000/ws/meeting/<meeting_id>/
```

### Message Types (Client → Server)

| Type | Payload | Description |
|---|---|---|
| `join` | `{ name }` | Announce presence to room peers |
| `offer` | `{ target, offer, name }` | Send WebRTC SDP offer to a specific peer |
| `answer` | `{ target, answer }` | Send WebRTC SDP answer to a specific peer |
| `ice_candidate` | `{ target, candidate }` | Forward ICE candidate to a peer |
| `chat` | `{ message, name }` | Broadcast a chat message or control signal |

### Control Message Strings (via `chat` type)

These special `__CONTROL__` prefixed messages handle host moderation:

| Control String | Direction | Effect |
|---|---|---|
| `__CONTROL__:admit_peer:peerId=<id>` | Host → All | Admit a guest from the waiting room |
| `__CONTROL__:deny_peer:peerId=<id>` | Host → All | Deny a guest from the waiting room |
| `__CONTROL__:kick_peer:peerId=<id>` | Host → All | Remove a participant |
| `__CONTROL__:mute_peer:peerId=<id>` | Host → All | Mute a participant's microphone |
| `__CONTROL__:unmute_peer:peerId=<id>` | Host → All | Unmute a participant's microphone |
| `__CONTROL__:stop_video_peer:peerId=<id>` | Host → All | Turn off a participant's camera |
| `__CONTROL__:meeting_ended` | Host → All | End the session for all participants |
| `__CONTROL__:status:muted=<bool>,cameraOff=<bool>` | Peer → All | Broadcast own mic/camera status |
| `__CONTROL__:reaction:<emoji>` | Peer → All | Broadcast an emoji reaction |
| `__CONTROL__:request_admit:peerId=<id>,name=<name>` | Guest → Host | Request to be admitted from waiting room |

---

<br/>

## 🎨 Pages & Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing / marketing homepage |
| `/auth/register` | Public | User registration with OTP |
| `/auth/signin` | Public | Email/password login or Google SSO |
| `/dashboard` | 🔒 Auth | Main dashboard — meeting overview |
| `/dashboard/recordings` | 🔒 Auth | Locally saved meeting recordings |
| `/dashboard/settings` | 🔒 Auth | Account and app settings |
| `/meeting/[id]` | 🔒 Auth | **Live meeting room** — video, chat, controls |
| `/join` | 🔒 Auth | Join a meeting by entering an ID |
| `/schedule` | 🔒 Auth | Schedule a new meeting |
| `/about` | Public | About ZoomX |
| `/blog` | Public | Blog articles |
| `/careers` | Public | Careers page |
| `/changelog` | Public | Version changelog |
| `/contact` | Public | Contact form |
| `/docs` | Public | Developer documentation |
| `/help` | Public | Help center |
| `/press` | Public | Press and media |
| `/security` | Public | Security overview |
| `/status` | Public | System status page |

---

<br/>

## 🧩 Component Library

### Meeting Components (`src/components/meeting/`)

| Component | Description |
|---|---|
| `VideoGrid` | Responsive CSS Grid that auto-layouts participant tiles — scales from 1 to N participants |
| `VideoTile` | Individual participant card — shows live video, name overlay, mute/camera indicators |
| `ControlBar` | Bottom meeting controls — mic, camera, screen share, emoji, chat, participants, leave/end |
| `ParticipantPanel` | Slide-in panel — shows active participants + waiting room queue with host controls |
| `ChatPanel` | Slide-in real-time chat — messages with sender name, email, Gravatar avatar |
| `EmojiReaction` | Animated floating emoji that rises and fades using Framer Motion |

### Key Custom Hooks (`src/hooks/`)

| Hook | Description |
|---|---|
| `useWebRTC` | Main signaling engine — manages WebSocket connection, peer connections, ICE negotiation, chat, and all host control channels |
| `useAuth` | Reads JWT auth context — exposes `user`, `token`, `isAuthenticated` |
| `useRequireAuth` | Route guard — redirects to `/auth/signin` if not authenticated |
| `useMeetings` | Fetch and mutate user meetings via the REST API |
| `useClipboard` | Clipboard write with visual copy-confirmed state |

---

<br/>

## 🔒 Security

ZoomX is built with security as a first-class concern:

| Feature | Implementation |
|---|---|
| **JWT Authentication** | Short-lived access tokens + refresh token rotation via DRF SimpleJWT |
| **OTP Email Verification** | New accounts require a 6-digit code emailed before activation |
| **Google ID Token Verification** | Backend verifies Google tokens server-side using `google-auth` library — never trusts the client |
| **CORS Policies** | `django-cors-headers` restricts accepted origins to your frontend URL |
| **Waiting Room Lobby** | Guests cannot join meetings until explicitly admitted by the host — eliminates uninvited access |
| **Host-Only Control Signals** | Moderation commands (kick, mute, end) are only trusted when sent by the verified host peer |
| **P2P Encryption** | All WebRTC streams use DTLS-SRTP encryption by default — end-to-end encrypted |
| **No Media on Server** | Video and audio never pass through the server — only signaling metadata does |

---

<br/>

## 🚢 Deployment

### Frontend (Vercel — Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the frontend directory
cd Frontend/zoomx-connect
vercel --prod

# Set these environment variables in the Vercel dashboard:
# NEXT_PUBLIC_API_BASE_URL=https://your-backend.com
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Backend (DigitalOcean / AWS / Railway)

```bash
# Install production dependencies
pip install gunicorn psycopg2-binary

# Collect static files
python manage.py collectstatic --noinput

# Run with Daphne (ASGI — required for WebSocket support)
daphne -b 0.0.0.0 -p 8000 ZoomX.asgi:application
```

**Nginx Configuration** (reverse proxy for production):
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;

        # Required for WebSocket upgrade
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

> ⚠️ The `proxy_set_header Upgrade` and `Connection "upgrade"` lines are **required** — without them, WebSocket connections will fail and no video meetings will be possible.

---

<br/>

## 🤝 Contributing

Contributions are very welcome! Here's how to get started:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/your-username/ZoomX.git

# 3. Create a feature branch
git checkout -b feature/your-amazing-feature

# 4. Make your changes and commit
git commit -m "feat: add your amazing feature"

# 5. Push to your fork
git push origin feature/your-amazing-feature

# 6. Open a Pull Request on GitHub
```

**Commit Message Convention:**

| Prefix | When to use |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes only |
| `style:` | Formatting, no logic change |
| `refactor:` | Code change, neither feature nor fix |
| `perf:` | Performance improvement |
| `chore:` | Build/tooling changes |

---

<br/>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<br/>

<div align="center">

**Built with ❤️ using Next.js, Django, and WebRTC**

*ZoomX — Where every connection matters.*

</div>
