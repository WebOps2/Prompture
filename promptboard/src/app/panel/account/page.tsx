"use client";

import EmptyDashBoard from "@/app/EmptyDashboard";
import ChangePassword from "@/components/ChangePassword";
import ExportDataSection from "@/components/ExportData";
import { userHasPrompts } from "@/components/HasPrompts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { hasPrompts, loading: hasPromptLoading, error } = userHasPrompts();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);


  const handleSave = () => {
    console.log("Saving Full Name:", fullName);
    // TODO: Add Supabase update logic here
  };

  useEffect(() => {
    const fetchUserData = async () => {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error("Error fetching user data:", error);
          return;
        }
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setMemberSince(new Date(user.created_at).toLocaleDateString());
        setLoading(false);
    }
    fetchUserData();
  }, []);

  if (hasPromptLoading) {
    return <div className="flex justify-center items-center h-[50vh]">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        {/* Profile Icon */}
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
          <UserCircle className="w-8 h-8 text-gray-700" />
        </div>

        {/* Name & Email */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{fullName}</h2>
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
          Save Changes
        </Button>
      </div>
        {/* Change Password Section */}
        <ChangePassword />
        {/* Export Data Section */}
        <ExportDataSection />
    </div>
  );
}
