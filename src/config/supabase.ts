// Temporary compatibility exports while older UI files are migrated away from Supabase naming.
export {
  ServerAuth as SupabaseAuth,
  type ServerUser as SupabaseUser,
  type ServerSession as SupabaseSession,
  isServerDatabaseEnabled as isSupabaseConfigured,
  apiRequest as supabaseRequest,
} from "./apiClient";
