"use client";

import AuthCard from "@/components/ui/auth/AuthCard";
import AuthFooter from "@/components/ui/auth/AuthFooter";
import AuthHeader from "@/components/ui/auth/AuthHeader";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center py-10 space-y-6">
      <AuthHeader />
      <AuthCard mode="login" />
      <AuthFooter mode="login" />
    </main>
  );
}
