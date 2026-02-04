"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import useUser from "@/hooks/use-user";
import { supabase } from "@/lib/supabase-client";
import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user} = useUser();
  const AUTO_LOGOUT_MS = 60 * 60 * 1000  

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    const updateLastActive = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity && Date.now() - parseInt(lastActivity) > AUTO_LOGOUT_MS) {
          supabase.auth.signOut();
          router.replace("/login");
        }
      }, AUTO_LOGOUT_MS);

    }
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
    const events = ["click", "touchstart", "keydown", "mousemove", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, updateLastActive);
    })
    updateLastActive(); // Initial call to set last activity
    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActive);
      });
    };
    

  }, []);

  // Dark mode initialization and sync
  useEffect(() => {
    // Check initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Watch for changes (in case theme is changed elsewhere)
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!checked) return null; // Or a loading spinner
  // if (loading) return null; // Or a loading spinner

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden animate-in fade-in duration-400">
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

            {/* Right: Moon/Sun icon, vertically aligned */}
            <button 
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Page content */}
          <div className="flex-1 px-4 sm:px-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
