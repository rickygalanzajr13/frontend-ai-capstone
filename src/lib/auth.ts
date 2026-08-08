import { supabase } from "@/lib/supabase";

export async function signUpWithEmail({
  email,
  password,
  name,
  username,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username,
      },
    },
  });
}

export async function signInWithEmail(
  email: string,
  password: string,
) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}