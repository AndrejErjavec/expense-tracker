import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

// Sign up
export async function signUp(supabase: SupabaseClient<Database>, email: string, username: string, password: string) {
  console.log("signup");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
        email: email,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign in
export async function signIn(supabase: SupabaseClient<Database>, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut(supabase: SupabaseClient<Database>) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
