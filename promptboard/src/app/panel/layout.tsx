"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useUser from "@/hooks/use-user";
import { supabase } from "@/lib/supabase-client";
import { Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    };
    

    check();
  }, []);

  if (!checked) return null; // Or a loading spinner
  if (loading) return null; // Or a loading spinner

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden animate-in fade-in duration-300">
        <AppSidebar />

        <main className="flex flex-col overflow-y-auto w-full">
          {/* Header */}
          <div className="flex justify-between px-4 sm:px-6 py-4 border-b border-gray-200 w-full">
            {/* Left: SidebarTrigger + Greeting */}
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 whitespace-nowrap">
                  Hi {user} <span>👋</span>
                </h1>
                <p className="text-muted-foreground text-sm truncate">
                  Welcome to your prompt dashboard
                </p>
              </div>
            </div>

            {/* Right: Moon icon, vertically aligned */}
            <button className="text-muted-foreground hover:text-foreground">
              <Moon className="w-5 h-5" />
            </button>
          </div>

          {/* Page content */}
          <div className="flex-1 px-4 sm:px-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
