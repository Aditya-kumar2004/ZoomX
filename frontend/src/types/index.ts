export interface Meeting {
  id: number;
  meeting_id: string;
  title: string;
  description: string;
  invite_link: string;
  scheduled_time: string | null;
  duration: number;
  is_active: boolean;
  created_at: string;
  participants: Participant[];
  host_email?: string | null;
}

export interface Participant {
  id: number;
  display_name: string;
  joined_at: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
