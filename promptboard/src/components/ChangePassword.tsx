"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";

export default function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePasswordUpdate = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Supabase password update
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
      <p className="text-sm text-gray-500 mb-6">Change your account password.</p>

      {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

      {/* Current Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>

      {/* New Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      {/* Confirm New Password */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      {/* Update Button */}
      <Button
        onClick={handlePasswordUpdate}
        className="bg-purple-600 hover:bg-purple-700 text-white"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </div>
  );
}
