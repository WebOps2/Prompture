"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export default function Login() {
  return (
    <main>
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-1 text-center">Welcome back to PromptBoard</h2>
        <p className="text-sm text-center mb-6 text-gray-500">
          Your Personal prompt Library
        </p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Input type="password" placeholder="Enter your password" />
              <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
          </div>

          <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white hover:opacity-90">
            Login
          </Button>
        </div>
      </div>

      <div className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
