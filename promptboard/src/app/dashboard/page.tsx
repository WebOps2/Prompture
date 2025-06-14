"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        const fullName = data.user.user_metadata.full_name;
        setUserName(fullName);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
      <h1 className="text-3xl font-bold">
        {userName ? `Hello, ${userName}!` : "Loading..."}
      </h1>
      <Button
        className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white hover:opacity-90"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </main>
  );
}
