import type { Meeting, Participant, User, AuthTokens } from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

// ── Token storage helpers ───────────────────────────────────────────────────────────
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// ─────────────────────────────────────────────────────────────────────────────

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),           // ← JWT token injected on every request
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data && (data.error || data.message)) {
        errMsg = data.error || data.message;
      }
    } catch {
      // ignore JSON parsing errors for non-JSON responses
    }
    const err = new Error(errMsg);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json() as Promise<T>;
}

export const meetingAPI = {
  createInstant: () => request<Meeting>("/meetings/create/", { method: "POST" }),
  getMeeting: (id: string) => request<Meeting>(`/meetings/${id}/`),
  joinMeeting: (id: string, displayName: string) =>
    request<{ meeting: Meeting; participant: Participant }>(`/meetings/${id}/join/`, {
      method: "POST",
      body: JSON.stringify({ display_name: displayName }),
    }),
  scheduleMeeting: (data: {
    title: string;
    description: string;
    scheduled_time: string;
    duration: number;
  }) =>
    request<Meeting>("/meetings/schedule/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getUpcoming: () => request<Meeting[]>("/meetings/upcoming/"),
  getRecent: () => request<Meeting[]>("/meetings/recent/"),
  deleteMeeting: async (meetingId: string) => {
    const res = await fetch(`${BASE_URL}/meetings/${meetingId}/delete/`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error('Failed to delete');
  },
};

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ message: string }>("/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyOTP: (data: { email: string; otp: string }) =>
    request<{ message: string; user: User; tokens: AuthTokens }>("/auth/verify-otp/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; user: User; tokens: AuthTokens }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  googleLogin: (token: string) =>
    request<{ message: string; user: User; tokens: AuthTokens }>("/auth/google/", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  /** Exchange the stored refresh token for a new access token. */
  refreshToken: (refreshToken: string) =>
    request<{ access: string }>("/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
    }),
};

// Mock data so the UI looks great even when backend is not running.
// TODO: Remove mock data when connecting to real backend
export const mockMeetings = {
  upcoming: [
    {
      id: 1,
      meeting_id: "abc-1234-xyz",
      title: "Product Sync — Q3 Roadmap",
      description: "Quarterly planning",
      invite_link: "https://zoomx.app/join/abc-1234-xyz",
      scheduled_time: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      duration: 60,
      is_active: true,
      created_at: new Date().toISOString(),
      participants: [
        { id: 1, display_name: "Alex Morgan", joined_at: "" },
        { id: 2, display_name: "Jamie Chen", joined_at: "" },
        { id: 3, display_name: "Sam Rivera", joined_at: "" },
      ],
    },
    {
      id: 2,
      meeting_id: "def-5678-uvw",
      title: "Design Review — Dashboard v2",
      description: "Review proposals",
      invite_link: "https://zoomx.app/join/def-5678-uvw",
      scheduled_time: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
      duration: 45,
      is_active: true,
      created_at: new Date().toISOString(),
      participants: [
        { id: 1, display_name: "Priya Nair", joined_at: "" },
        { id: 2, display_name: "Marcus Reid", joined_at: "" },
      ],
    },
  ] as Meeting[],
  recent: [
    {
      id: 11,
      meeting_id: "rec-1111-aaa",
      title: "Weekly Standup",
      description: "",
      invite_link: "https://zoomx.app/join/rec-1111-aaa",
      scheduled_time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      duration: 30,
      is_active: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      participants: [
        { id: 1, display_name: "Alex Morgan", joined_at: "" },
        { id: 2, display_name: "Jamie Chen", joined_at: "" },
      ],
    },
    {
      id: 12,
      meeting_id: "rec-2222-bbb",
      title: "Customer Interview — Acme",
      description: "",
      invite_link: "https://zoomx.app/join/rec-2222-bbb",
      scheduled_time: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      duration: 45,
      is_active: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      participants: [{ id: 1, display_name: "Sarah Chen", joined_at: "" }],
    },
    {
      id: 13,
      meeting_id: "rec-3333-ccc",
      title: "Engineering All-Hands",
      description: "",
      invite_link: "https://zoomx.app/join/rec-3333-ccc",
      scheduled_time: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      duration: 60,
      is_active: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      participants: [
        { id: 1, display_name: "Sam Rivera", joined_at: "" },
        { id: 2, display_name: "Priya Nair", joined_at: "" },
        { id: 3, display_name: "Marcus Reid", joined_at: "" },
        { id: 4, display_name: "Jamie Chen", joined_at: "" },
      ],
    },
  ] as Meeting[],
};
