"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

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

  if (!checked) return null; // or a loading spinner

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex justify-between gap-4 overflow-y-auto p-6">
            <SidebarTrigger />
            {children}

        </main>
      </div>
    </SidebarProvider>
  );
}
