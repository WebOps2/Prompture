"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { EyeIcon } from "lucide-react";

interface AuthCardProps {
  mode: "login" | "signup";
}

export default function AuthCard({ mode }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-1 text-center">
        {mode === "login" ? "Welcome back to PromptBoard" : "Join PromptBoard"}
      </h2>
      <p className="text-sm text-center mb-6 text-gray-500">
        {mode === "login"
          ? "Your Personal prompt Library"
          : "Create your prompt management workspace"}
      </p>

      <div className="space-y-6">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input type="text" placeholder="Enter your full name" />
          </div>
        )}

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

        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Input type="password" placeholder="Confirm your password" />
              <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
        )}

        <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white hover:opacity-90">
          {mode === "login" ? "Login" : "Sign Up"}
        </Button>
      </div>
    </motion.div>
  );
}
