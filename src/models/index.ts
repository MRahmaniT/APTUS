export type Role = "guest" | "member" | "admin" | "manager";

export interface UserProfile {
  uid?: string;
  name: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  role?: Role;
}

export interface AnalyticsData {
  totalViews: number;
  totalMembers: number;
}
