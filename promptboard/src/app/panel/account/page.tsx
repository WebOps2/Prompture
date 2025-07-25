"use client";

import ChangePassword from "@/components/ChangePassword";
import DangerZone from "@/components/Delete";
import ExportDataSection from "@/components/ExportData";
import { UserHasPrompts } from "@/components/HasPrompts";
import ChromeExtensionCard from "@/components/Synced";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { loading: hasPromptLoading, error } = UserHasPrompts();

  const [displayName, setDisplayName] = useState(""); // Header display
  const [editableName, setEditableName] = useState(""); // Input field value
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError?.message);
        alert("You must be logged in to update profile.");
        setSaving(false);
        return;
      }

      // ✅ Update in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: editableName })
        .eq("id", user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError.message);
        alert("Failed to update profile.");
        setSaving(false);
        return;
      }

      // ✅ Update auth metadata (optional)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: editableName },
      });

      if (metadataError) {
        console.warn("User metadata not updated:", metadataError.message);
      }

      // ✅ Update header display only after successful save
      setDisplayName(editableName);

    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error fetching user data:", error);
        return;
      }

      const name = user.user_metadata?.full_name || "";
      setEmail(user.email || "");
      setEditableName(name); // Input field value
      setDisplayName(name); // Header display
      setMemberSince(new Date(user.created_at).toLocaleDateString());
    };

    fetchUserData();
  }, []);

  if (hasPromptLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // if (!hasPrompts) {
  //   return <EmptyDashBoard />;
  // }

  return (
    <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
          <UserCircle className="w-8 h-8 text-gray-700" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{displayName}</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* Personal Information Form */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>

        {/* Full Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            value={editableName}
            onChange={(e) => setEditableName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <Input value={email} readOnly className="bg-gray-100" />
          <p className="text-xs text-gray-500 mt-1">Your email address cannot be changed.</p>
        </div>

        {/* Member Since */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-gray-800">{memberSince}</p>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Other Sections */}
      <ChangePassword />
      <ExportDataSection />
      <ChromeExtensionCard />
      <DangerZone />
    </div>
  );
}
