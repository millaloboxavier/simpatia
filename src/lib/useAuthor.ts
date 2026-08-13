"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useAuthor() {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setLoading(false);
        return;
      }
      const { data: author } = await supabase.from("authors").select("user_id").eq("user_id", uid).maybeSingle();
      setIsAuthor(!!author);
      setLoading(false);
    });
  }, [supabase]);

  return { supabase, userId, isAuthor, loading };
}
