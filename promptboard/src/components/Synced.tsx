"use client";

import { supabase } from "@/lib/supabase-client";
import { Chrome } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChromeExtensionSync() {
  const [lastSynced, setLastSynced] = useState("Loading...");
  const [status, setStatus] = useState<"Synced" | "Not Synced">("Not Synced");

  useEffect(() => {
    const fetchLastSynced = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError?.message);
        setLastSynced("Not logged in");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("last_synced, extension_installed")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching last synced:", error.message);
        setLastSynced("Error");
        return;
      }

      console.log("Fetched last synced data:", data);

      if (data?.last_synced && data?.extension_installed) {
        const date = new Date(data.last_synced);
        const now = new Date();
        const diffInMinutes = Math.floor(
          (now.getTime() - date.getTime()) / 1000 / 60
        );

        if (diffInMinutes < 1) {
          setLastSynced("Just now");
        } else if (diffInMinutes < 60) {
          setLastSynced(`${diffInMinutes} min ago`);
        } else {
          const diffInHours = Math.floor(diffInMinutes / 60);
          setLastSynced(`${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`);
        }

        setStatus(data.extension_installed ? "Synced" : "Not Synced");
      } else {
        setLastSynced("Never synced");
        setStatus("Not Synced");
      }
    };

    fetchLastSynced();
  }, []);

  return (
    <div className=" bg-white">
      <h2 className="text-xl font-semibold">Chrome Extension</h2>
      <p className="text-gray-500 text-sm">
        Sync your data with the PromptBoard Chrome extension.
      </p>

      <div className="mt-4 flex items-center justify-between rounded-lg border p-4 hover:shadow-md transition">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Chrome className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">Chrome Extension</p>
            <p className="text-sm text-gray-500">Last synced: {lastSynced}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "Synced"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
