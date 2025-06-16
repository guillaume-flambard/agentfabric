export const config = {
  supabase: {
    url: import.meta.env.PUBLIC_SUPABASE_URL || '',
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
  }
};
