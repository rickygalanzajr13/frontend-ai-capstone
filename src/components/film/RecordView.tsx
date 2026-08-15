import { useEffect } from "react";

import { useAuth } from "@/hooks/use-auth";
import { recordRecentlyViewed } from "@/lib/profile-data";

/** Records the open film in the signed-in user's recently viewed history. */
export function RecordView({
  film,
}: {
  film: { imdbID: string; Title: string; Poster: string; Year: string };
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    void recordRecentlyViewed(user.id, film);
  }, [user?.id, film.imdbID]);

  return null;
}
