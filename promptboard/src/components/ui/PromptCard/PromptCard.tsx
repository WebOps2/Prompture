"use client";

import { format } from "date-fns";
import { CalendarDays, Eye, MoreHorizontal, Pencil, Star } from "lucide-react";

type Prompt = {
  id: string;
  Title?: string;
  prompt: string;
  timestamp: string;
  last_used?: string;
  tags?: string[];
  source: string;
  favorited?: boolean;
};

export const PromptCard = ({ prompt }: { prompt: Prompt }) => {
  return (
    <div className="relative group border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md duration-200 ease-out">
      {/* View / More Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </div>
        <button className="text-zinc-500 hover:text-zinc-700 dark:hover:text-white">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Source */}
      <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
        {prompt.source}
      </span>

      {/* Title */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-2">
        {prompt.Title || "Untitled Prompt"}
      </h3>

      {/* Dates */}
      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>Created {format(new Date(prompt.timestamp), "MMM d, yyyy")}</span>
        </div>
        {prompt.last_used && (
          <>
            <span className="mx-1">•</span>
            <span>Last used {format(new Date(prompt.last_used), "MMM d, yyyy")}</span>
          </>
        )}
      </div>

      {/* Prompt Preview */}
      <div className="bg-zinc-100 dark:bg-zinc-800 p-3 mt-4 rounded-xl text-sm text-zinc-800 dark:text-zinc-200 line-clamp-3">
        {prompt.prompt}
        <span className="text-indigo-600 dark:text-indigo-400 ml-1 inline-flex items-center cursor-pointer hover:underline">
          Read more <Eye className="w-4 h-4 ml-1" />
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {(prompt.tags || []).map((tag) => (
          <span
            key={tag}
            className="bg-zinc-200 dark:bg-zinc-700 text-xs px-3 py-1 rounded-full font-medium text-zinc-700 dark:text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom Right Icons */}
      <div className="flex justify-end gap-4 mt-6 text-zinc-500 dark:text-zinc-400">
        <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-500" />
        <Star
          className={`w-4 h-4 cursor-pointer transition ${
            prompt.favorited
              ? "fill-yellow-400 text-yellow-400"
              : "hover:text-yellow-400"
          }`}
        />
      </div>
    </div>
  );
};
