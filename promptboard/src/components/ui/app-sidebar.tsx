"use client";

import useUser from "@/hooks/use-user";
import { supabase } from "@/lib/supabase-client";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Trash2,
  User,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { user, email} = useUser();


  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);
  const router = useRouter();

  const items = [
    {
      title: "Dashboard",
      href: "/panel/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Prompts",
      href: "/panel/prompts",
      icon: FileText,
    },
    {
      title: "Trash",
      href: "/panel/trash",
      icon: Trash2,
    },
    {
      title: "Account",
      href: "/panel/account",
      icon: User,
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <Sidebar className="bg-white border-r w-64 h-full flex flex-col justify-between animate-in fade-in duration-400">
      <SidebarContent className="p-4 space-y-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-gradient-to-br from-purple-500 to-violet-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
            P
          </div>
          <span className="font-semibold text-xl text-gray-900">PromptBoard</span>
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-gray-500 px-2">MENU</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / Profile */}
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-gray-700" />
          <> </>
          <div className="text-sm leading-tight">
            <div className="font-medium text-gray-800">{user}</div>
            <div className="text-gray-500 text-xs">{email}</div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-red-500 transition" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </Sidebar>
  );
}
