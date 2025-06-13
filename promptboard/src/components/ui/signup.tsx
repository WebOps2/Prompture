"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  // I want the promtBoard sign to be a bit higher than the signup card
  return (
    <main>
         <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-1 text-center">Join PromptBoard</h2>
        <p className="text-sm text-center mb-6 text-gray-500">
          Create your prompt management workspace
        </p>

        <div className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input type="text" placeholder="Enter your Full Name" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="Enter your email" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Input type="password" placeholder="Enter a strong password" />
              <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Input type="password" placeholder="Confirm your password" />
              <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white hover:opacity-90">
            Sign Up
          </Button>
        </div>
      </div>
      {/* Footer */}
      <div className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </div>
    </main>
   
  );
}
