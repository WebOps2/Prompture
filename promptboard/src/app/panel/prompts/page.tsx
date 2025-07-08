'use client';

import EmptyDashBoard from '@/app/EmptyDashboard';
import { Input } from "@/components/ui/input";
import { PromptCard } from '@/components/ui/PromptCard/PromptCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase-client';
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from 'react';

type Prompt = {
  id: string;
  prompt: string;
  timestamp: string;
  source: string;
  tags?: string[];
  title?: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasPrompts, setHasPrompts] = useState(false);
  const [selectedDay, setSelectedDay] = useState("All Days");
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  // const [selectedTag, setSelectedTag] = useState("All");
  // const [prompts, setPrompts] = useState<{ timestamp: string }[]>([]);
  const days = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  // const platforms = ["All Platforms", "chat.openai.com", "claude.ai", "bard.google.com", "poe.com"];
  // const popularTags = ["research", "code", "personal", "debug", "idea"];
  const [selectedTag, setSelectedTag] = useState("All");
  const [customTag, setCustomTag] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All Months");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [platforms, setPlatforms] = useState<string[]>(["All Platforms"]);
  const [years, setYears] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const months = [
  "All Months", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  // const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  // const years = ["All", "2023", "2024", "2025"]
  const [selectedRange, setSelectedRange] = useState("All Time");

  const timeRanges = ["All Time", "Today", "This Week", "This Month"];
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  // const finalTag = selectedTag !== "Other" ? selectedTag : customTag;
  const filterPrompts = prompts.filter((prompt) => {
      const matchesDay = selectedDay === "All Days" || new Date(prompt.timestamp).toLocaleString('en-US', { weekday: 'long' }) === selectedDay;
      const matchesMonth = selectedMonth === "All Months" || new Date(prompt.timestamp).toLocaleString('en-US', { month: 'long' }) === selectedMonth;
      const matchesYear = selectedYear === "All Years" || new Date(prompt.timestamp).getFullYear().toString() === selectedYear;
      const matchesPlatform = selectedPlatform === "All Platforms" || prompt.source === selectedPlatform;
      const matchesTag = selectedTag === "All" || (prompt.tags && prompt.tags.includes(selectedTag)) || (selectedTag === "Other" && customTag && prompt.tags && prompt.tags.includes(customTag));
      const matchesRange = selectedRange === "All Time" ||
        (selectedRange === "Today" && new Date(prompt.timestamp).toDateString() === new Date().toDateString()) ||
        (selectedRange === "This Week" && 
          new Date(prompt.timestamp).getTime() >= new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).getTime() &&
          new Date(prompt.timestamp).getTime() <= new Date().getTime()) ||  
        (selectedRange === "This Month" && new Date(prompt.timestamp).getMonth() === new Date().getMonth() &&
          new Date(prompt.timestamp).getFullYear() === new Date().getFullYear()); 

      return matchesDay && matchesMonth && matchesYear && matchesPlatform && matchesTag && matchesRange;
    })
    const start = (currentPage - 1) * promptsPerPage;
    const paginatedPrompts = filterPrompts.slice(start, start + promptsPerPage);  


  useEffect(() => {
    
    const fetchAllPrompts = async () => {
      // const from = (page - 1) * promptsPerPage;
      // const to = from + promptsPerPage - 1;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

    const { data,  error } = await supabase
      .from("prompts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });


      if (error) {
      console.error("Error fetching prompts:", error);
      return;
    }
    
    setPrompts(data);
    setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage));
    }

    const loadPromptDateMetadata = async () => {
    const { data, error } = await supabase
      .from("prompts")
      .select("timestamp") // only need timestamp if you're not showing prompts yet
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ Failed to load timestamps:", error);
    } else {
      const uniqueYears = Array.from(new Set(data.map((p) => new Date(p.timestamp).getFullYear().toString())));
      setYears(["All Years", ...uniqueYears]); // or setTimestamps(data)
    }
  };
  const fetchTags = async () => {
      const { data, error } = await supabase.from("prompts").select("tags");

      if (error) {
        console.error("Error fetching tags:", error);
        return;
      }

      const tagSet = new Set<string>();
      data.forEach((row) => {
        if (Array.isArray(row.tags)) {
          row.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });

      setPopularTags(Array.from(tagSet));
    };
  const fetchPlatforms = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("prompts")
        .select("source", { count: "exact", head: false })
        .eq("user_id", user.id);


      if (error) {
        console.error("Error fetching platforms:", error);
        return;
      }else{
        const uniquePlatforms = Array.from(new Set(data.map((p) => p.source)));
        setPlatforms(["All Platforms", ...uniquePlatforms]);
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

    fetchAllPrompts();
    fetchPlatforms()
    fetchPrompts();
    loadPromptDateMetadata();
    fetchTags();
    // console.log(pro)
    setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage))

    
  }, []);
  useEffect(() => {
    setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage));
  }, [filterPrompts])
  // console.log("Prompts loaded:", prompts);
//   const years = useMemo(() => {
//   const allYears = prompts.map((p) =>
//     new Date(p.timestamp).getFullYear().toString()
//   );
//   return ["All Years", ...Array.from(new Set(allYears))];
// }, [prompts]);
  

    console.log("Filtered prompts:", filterPrompts);


  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }
  console.log("User has prompts:", hasPrompts);
  // ✅ Inline Hello World view if user has prompts
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 text-transparent bg-clip-text">
        Prompt Library
      </h1>
      <p className="text-muted-foreground text-base">
        Search, filter, and organize your saved AI prompts
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto mt-6">
        <Input
          type="text"
          placeholder="Search prompts by keywords, tags, or content..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />
      </div>

      {/* Filters - Now Responsive */}
      <div className="w-full max-w-4xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
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
          <Select value={selectedTag} onValueChange={(v) => {
            setSelectedTag(v);
            if (v !== "Other") setCustomTag("");
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tags</SelectItem>
              {popularTags.map((tag) => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
              <SelectItem value="Other">Other...</SelectItem>
            </SelectContent>
          </Select>
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRange} onValueChange={setSelectedRange}>
          <SelectTrigger className="w-full gap-2">
            <CalendarDays className="w-4 h-4" />
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Prompt Count */}
      <p className="mt-4">
        <strong>{filterPrompts.length}</strong> {filterPrompts.length === 1 ? "prompt" : "prompts"} found
      </p>
      <div className="grid grid-cols-1 gap-4 mt-10 pb-4">
        {paginatedPrompts.length > 0 ? (
          paginatedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No prompts found for selected filters.
          </p>
        )}
      </div>
      <div className="flex justify-center items-center gap-2 mt-6 mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page) }
            className={`px-4 py-2 rounded ${
              page === currentPage ? "bg-indigo-500 text-white" : "bg-zinc-900 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-zinc-800 text-zinc-400" : "bg-orange-500 text-black font-semibold hover:bg-orange-400"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
