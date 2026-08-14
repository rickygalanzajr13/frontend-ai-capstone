import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;

      switch (event) {
        case "SIGNED_IN":
        case "SIGNED_OUT":
        case "TOKEN_REFRESHED":
        case "USER_UPDATED":
        case "INITIAL_SESSION":
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          setLoading(false);
          break;
        default:
          break;
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, loading };
}
