'use client';

import EmptyDashBoard from '@/app/EmptyDashboard';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase-client';
import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from 'react';

// type Prompt = {
//   id: string;
//   prompt: string;
//   timestamp: string;
//   site: string;
//   tags?: string[];
//   title?: string;
// };

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasPrompts, setHasPrompts] = useState(false);
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  // const [selectedTag, setSelectedTag] = useState("All");
  const [prompts, setPrompts] = useState<{ timestamp: string }[]>([]);
  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const platforms = ["All", "chat.openai.com", "claude.ai", "bard.google.com", "poe.com"];
  const popularTags = ["research", "code", "personal", "debug", "idea"];
  const [selectedTag, setSelectedTag] = useState("All");
  const [customTag, setCustomTag] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const months = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  // const years = ["All", "2023", "2024", "2025"]
  const [selectedRange, setSelectedRange] = useState("All Time");

  const timeRanges = ["All Time", "Today", "This Week", "This Month"];

  // const finalTag = selectedTag !== "Other" ? selectedTag : customTag;


  useEffect(() => {
    const loadPromptDateMetadata = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("timestamp") // only need timestamp if you're not showing prompts yet
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ Failed to load timestamps:", error);
    } else {
      setPrompts(data); // or setTimestamps(data)
    }
  };
    const fetchPrompts = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("prompts")
        .select("id")
        .eq("user_id", user.id)
        .limit(1); // just check for existence

      if (error) {
        console.error("Error fetching prompts", error);
        setLoading(false);
        return;
      }

      setHasPrompts(data.length > 0);
      setLoading(false);
    };

    fetchPrompts();
    loadPromptDateMetadata();
    // console.log(prompts)

    
  }, []);
  console.log("Prompts loaded:", prompts);
  const years = useMemo(() => {
  const allYears = prompts.map((p) =>
    new Date(p.timestamp).getFullYear().toString()
  );
  return ["All", ...Array.from(new Set(allYears))];
}, [prompts]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }
  console.log("User has prompts:", hasPrompts);
  // ✅ Inline Hello World view if user has prompts
  return (
    <div className="text-center space-y-2 ">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 text-transparent bg-clip-text">
        Prompt Library
      </h1>
      <p className="text-muted-foreground text-base">
        Search, filter, and organize your saved AI prompts
      </p>
      <div className="w-full max-w-4xl mx-auto mt-6">
        <input
          type="text"
          placeholder="Search prompts by keywords, tags, or content..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      <div className="w-full max-w-4xl mx-auto mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((site) => (
              <SelectItem key={site} value={site}>
                {site}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col gap-2">
        {/* Select Popular Tag */}
          <Select value={selectedTag} onValueChange={(v) => {
            setSelectedTag(v);
            if (v !== "Other") setCustomTag("");
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {popularTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
              <SelectItem value="Other">Other...</SelectItem>
            </SelectContent>
          </Select>

          {/* Show Text Input if 'Other' is Selected */}
          {selectedTag === "Other" && (
            <Input
              type="text"
              placeholder="Enter custom tag"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              className="text-sm"
            />
          )}
      </div>
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Filter by year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedRange} onValueChange={setSelectedRange}>
        <SelectTrigger className="w-44 px-3 py-2 border border-gray-300 rounded-xl flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <SelectValue placeholder="All Time" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {timeRanges.map((range) => (
            <SelectItem key={range} value={range}>
              {range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
    </div>
      </div>
    </div>
  );
}
