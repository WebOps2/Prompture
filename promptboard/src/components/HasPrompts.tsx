import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";

export function userHasPrompts() {
  const [hasPrompts, setHasPrompts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("No user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("prompts")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (error) {
        setError(error.message);
      } else {
        setHasPrompts(data.length > 0);
      }

      setLoading(false);
    };

    fetchPrompts();
  }, []);

  return { hasPrompts, loading, error };
}
