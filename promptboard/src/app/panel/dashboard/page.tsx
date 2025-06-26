'use client';

import EmptyDashBoard from '@/app/EmptyDashboard';
import { supabase } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasPrompts, setHasPrompts] = useState(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("prompts")
        .select("id")
        .eq("user_id", user.id)
        .limit(1); // just check for existence

      if (error) {
        console.error("Error fetching prompts", error);
        setLoading(false);
        return;
      }

      setHasPrompts(data.length > 0);
      setLoading(false);
    };

    fetchPrompts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }
  console.log("User has prompts:", hasPrompts);
  // ✅ Inline Hello World view if user has prompts
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-semibold">Hello World 🌍</h1>
      <p className="text-muted-foreground mt-2">You have prompts in your database!</p>
      <div>{hasPrompts}</div>
    </div>
  );
}
