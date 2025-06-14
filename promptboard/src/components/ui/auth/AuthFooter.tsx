"use client";

import Link from "next/link";

interface AuthFooterProps {
  mode: "login" | "signup";
}

export default function AuthFooter({ mode }: AuthFooterProps) {
  return (
    <div className="text-sm mt-4">
      {mode === "login" ? (
        <>
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </>
      )}
    </div>
  );
} 
