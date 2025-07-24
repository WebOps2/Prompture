"use client";

import { supabase } from "@/lib/supabase-client";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteAllData() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAllPrompts = async () => {
    if (!confirm("Are you sure? This will permanently delete all your prompts.")) return;

    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("You must be logged in to delete prompts.");
      setLoading(false);
      return;
    }

    // Delete all prompts for this user
    const { error } = await supabase.from("prompts").delete().eq("user_id", user.id);

    setLoading(false);

    if (error) {
      alert("Error deleting prompts: " + error.message);
    } else {
      alert("All prompts have been deleted.");
    }
  };

  return (
    <div className="mt-6 bg-white mb-6">
      <h2 className="text-xl font-semibold text-red-600">Delete All Data</h2>
      <p className="text-gray-500 text-sm mb-4">
        Permanently delete all your prompts and data.
      </p>

      <button
        onClick={handleDeleteAllPrompts}
        disabled={loading}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-5 py-2 rounded transition disabled:opacity-50"
      >
        <Trash2 className="w-5 h-5" />
        {loading ? "Deleting..." : "Delete All Prompts"}
      </button>
    </div>
  );
}
