import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw Error("Supabase url and annon key must be defined");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // keep user logged in (localStorage)
    autoRefreshToken: true, // refresh tokens automatically
    detectSessionInUrl: true, // for magic links / OAuth redirects
  },
});
