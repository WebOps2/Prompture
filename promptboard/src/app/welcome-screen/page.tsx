"use client";

import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import { BarChart3, Rocket, Sparkles } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      router.replace("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2b1e75] to-[#681da8] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg text-white rounded-3xl shadow-lg p-6 sm:p-10 md:p-14 max-w-xl w-full text-center space-y-6 border border-white/20"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-[#a470f0] p-3 rounded-xl relative inline-block">
            <Sparkles className="w-6 h-6 text-white" />
            {/* <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              ⚡
            </div> */}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
          PromptBoard
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90">
          Organize, manage, and optimize your AI prompts across ChatGPT, Gemini,
          Claude, and more. Your central hub for prompt engineering excellence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-white text-[#681da8] font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition" onClick={() => router.push("/panel/dashboard")}>
            Get Started
          </button>
          <button className="bg-white/10 border border-white/30 font-semibold px-6 py-3 rounded-full text-white hover:bg-white/20 transition" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-3 flex-wrap pt-4">
          <span className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
            <Sparkles className="w-4 h-4" /> Smart Organization
          </span>
          <span className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
            <Rocket className="w-4 h-4" /> Cross-Platform
          </span>
          <span className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
            <BarChart3 className="w-4 h-4" /> Analytics
          </span>
        </div>
      </motion.div>
    </div>
  );
}
