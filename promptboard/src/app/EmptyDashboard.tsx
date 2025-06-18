'use client';

import { BookOpen, Chrome, Sparkles, Zap } from 'lucide-react';


export default function EmptyDashBoard() {
  return (
    <div className="text-center space-y-10 max-w-3xl mx-auto px-4 sm:px-6 mt-10">
      {/* PromptBoard Icon */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4 rounded-2xl text-white relative">
          <Sparkles className="w-12 h-12" />
          <div className="absolute -top-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full" />
        </div>
      </div>

      {/* Headings */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to PromptBoard
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-2">
          Your AI Prompt Management Hub
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Manage, organize, and version your AI prompts with ease.
        </p>
      </div>

      {/* Flow Graphic */}
      <div className="border border-dashed border-gray-300 rounded-xl p-6 shadow-sm bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          {/* AI Chat */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="text-sm font-medium text-gray-700">AI Chat</span>
          </div>

          {/* Arrows + Line */}
          <div className="flex items-center gap-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-400" />
            <Zap className="w-6 h-6 text-purple-400 rotate-180" />
          </div>

          {/* PromptBoard */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-purple-100 p-4 rounded-xl text-purple-600">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-sm font-medium text-gray-700">PromptBoard</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Save prompts instantly with our Chrome extension while you chat
        </p>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-4 mt-10 px-2">
        <p className="text-gray-600">You haven't saved any prompts yet.</p>

        <div className="flex justify-center">
          <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition">
            <Chrome className="w-5 h-5" />
            Install Chrome Extension
          </button>
        </div>

        <p className="text-gray-600">
          Save prompts instantly while you chat with your favorite AI tools.
        </p>
      </div>

      {/* Feature Tags */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm mt-6 px-2">
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
          ✨ Auto-save prompts
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
          ⚡ Smart tagging
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
          📊 Usage analytics
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
          🗂️ Version control
        </div>
      </div>
    </div>
  );
}
