"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarDays, Copy, Eye, FilePlus2, MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";

import { supabase } from '@/lib/supabase-client'; // Adjust the import based on your project structure
import { useEffect, useState } from "react";


type Prompt = {
  id: string;
  Title?: string;
  prompt: string;
  timestamp: string;
  last_used?: string;
  tags?: string[];
  source: string;
  favorite?: boolean;
};

export const PromptCard = ({ prompt }: { prompt: Prompt }) => {
    const getPromptFontSize = (text: string) => {
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount <= 250) return "text-lg";       // short prompts
    if (wordCount <= 1000) return "text-sm";         // medium prompts
    return "text-base";                               // long prompts
    };

    const [expanded, setExpanded] = useState(false);
    // const contentRef = useRef<HTMLDivElement | null>(null);
    // const [showReadMore, setShowReadMore] = useState(false);
    const [MAX_LENGTH, setMaxLength] = useState(100); // characters before truncation
    const [isEditing, setIsEditing] = useState(false);
    const [editedPrompt, setEditedPrompt] = useState(prompt.prompt);
    const [localPrompt, setLocalPrompt] = useState(prompt.prompt);
    const [favorited, setFavorited] = useState(prompt.favorite || false);
    console.log(prompt.favorite, "favorited state");

    const handlePromptChange = (newText: string) => {
      setEditedPrompt(newText);
    };
    const handleSave = async () => {
      const { error } = await supabase
        .from("prompts")
        .update({ prompt: editedPrompt })
        .eq("id", prompt.id);

      if (error) {
        console.error("Error updating prompt:", error);
      } else {
        console.log("✅ Prompt updated!");
        setLocalPrompt(editedPrompt);   // update what displays
        setIsEditing(false);
      }
    };
    const toggleFavorite = async () => {
      const newValue = !favorited;

      const { error } = await supabase
        .from("prompts")
        .update({ favorite: newValue })
        .eq("id", prompt.id);

      if (error) {
        console.error("❌ Error updating favorite:", error);
      } else {
        console.log("✅ Favorite status updated!", newValue);
        setFavorited(newValue);
      }
    };
    
    useEffect(() => {
    const updateLength = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setMaxLength(100); // Mobile
      } else if (width < 1024) {
        setMaxLength(800); // Tablet
      } else {
        setMaxLength(1000); // Desktop
      }
    };

    updateLength();
    window.addEventListener("resize", updateLength);
    return () => window.removeEventListener("resize", updateLength);
  }, []);

    // const MAX_LENGTH = 100; // characters before truncation
    const isLong = localPrompt.length > MAX_LENGTH;

    const displayText = expanded || !isLong
    ? localPrompt
    : localPrompt.slice(0, MAX_LENGTH) + "...";

  return (
    <div className="relative group border rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md duration-200 ease-out ">
      {/* View / More Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-4 opacity-100 lg:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
          <Eye className="w-4 h-4" />
          <span className="text-sm">View</span>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="text-zinc-500 hover:text-zinc-700 dark:hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem className="gap-2" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4" />
                Edit Prompt
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                <FilePlus2 className="w-4 h-4" />
                Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem 
                className="gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(prompt.prompt)
                    .then(() => {
                      console.log("✅ Prompt copied!");
                      // Optional: show toast or UI feedback
                    })
                    .catch((err) => {
                      console.error("❌ Failed to copy:", err);
                    });
                }}>
                <Copy className="w-4 h-4" />
                Copy Content
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                <Star className={`w-4 h-4 ${prompt.favorite ? "fill-yellow-400 text-yellow-400" : "hover:text-yellow-400"}`} onClick={toggleFavorite}/>
                Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                <Trash2 className="w-4 h-4" />
                Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/*  */}

      {/* Source */}
      <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
        {prompt.source}
      </span>

      {/* Title */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mt-2 ">
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
      <div  className={`bg-zinc-100 dark:bg-zinc-800 p-3 mt-4 rounded-xl ${getPromptFontSize(prompt.prompt)} text-zinc-800 dark:text-zinc-200 whitespace-normal break-words `}>
        {/* {prompt.prompt} */}
        {/* <span className="text-indigo-600 dark:text-indigo-400 ml-1 inline-flex items-center cursor-pointer hover:underline">
            Read more <Eye className="w-4 h-4 ml-1" />
        </span> */}
        {isEditing ? (
    <>
      <textarea
        className="w-full rounded-md p-2 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 text-sm"
        rows={6}
        value={editedPrompt}
        onChange={(e) => handlePromptChange(e.target.value)}
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => {
            setIsEditing(false);
            setEditedPrompt(prompt.prompt); // reset text
          }}
          className="px-3 py-1 border rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
        >
          Update
        </button>
      </div>
    </>
  ) : (
    <span>
      {displayText}
      {isLong && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="ml-1 text-indigo-600 dark:text-indigo-400 hover:underline text-base"
        >
          Read more
        </button>
      )}
      {isLong && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline text-base"
        >
          View less
        </button>
      )}
    </span>
  )}
        
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
        <Pencil className="w-4 h-4 cursor-pointer hover:text-blue-500" onClick={() => setIsEditing(true)}/>
        <Star
          className={`w-4 h-4 cursor-pointer transition ${
            favorited
              ? "fill-yellow-400"
              : "hover:text-yellow-400"
          }`} onClick={toggleFavorite}
        />
      </div>
    </div>
  );
};
