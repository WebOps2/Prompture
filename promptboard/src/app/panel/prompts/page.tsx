'use client';

import EmptyDashBoard from '@/app/EmptyDashboard';
import PromptCardSkeleton from '@/components/Skeleton';
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
import { CalendarDays, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [semanticMode, setSemanticMode] = useState(false);
  const [semanticIds, setSemanticIds] = useState<string[]>([]);
  // const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  // const years = ["All", "2023", "2024", "2025"]
  const [selectedRange, setSelectedRange] = useState("All Time");

  const timeRanges = ["All Time", "Today", "This Week", "This Month"];
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const promptsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPages = parseInt(searchParams.get("page") || "1", 10);
  // const promptsPerPage = 20;
  // const finalTag = selectedTag !== "Other" ? selectedTag : customTag;
  const filterPrompts = prompts.filter((prompt) => {
      const matchesDay =
        selectedDay === "All Days" ||
        new Date(prompt.timestamp).toLocaleString("en-US", { weekday: "long" }) ===
          selectedDay;

      const matchesMonth =
        selectedMonth === "All Months" ||
        new Date(prompt.timestamp).toLocaleString("en-US", { month: "long" }) ===
          selectedMonth;

      const matchesYear =
        selectedYear === "All Years" ||
        new Date(prompt.timestamp).getFullYear().toString() === selectedYear;

      const matchesPlatform =
        selectedPlatform === "All Platforms" || prompt.source === selectedPlatform;

      const matchesTag =
        selectedTag === "All" ||
        (prompt.tags && prompt.tags.includes(selectedTag)) ||
        (selectedTag === "Other" &&
          customTag &&
          prompt.tags &&
          prompt.tags.includes(customTag));

      const matchesRange =
        selectedRange === "All Time" ||
        (selectedRange === "Today" &&
          new Date(prompt.timestamp).toDateString() ===
            new Date().toDateString()) ||
        (selectedRange === "This Week" &&
          new Date(prompt.timestamp).getTime() >=
            new Date(
              new Date().setDate(new Date().getDate() - new Date().getDay())
            ).getTime() &&
          new Date(prompt.timestamp).getTime() <= new Date().getTime()) ||
        (selectedRange === "This Month" &&
          new Date(prompt.timestamp).getMonth() === new Date().getMonth() &&
          new Date(prompt.timestamp).getFullYear() === new Date().getFullYear());

      const matchesSemantic =
        !semanticMode || semanticIds.includes(prompt.id);

      return (
        matchesDay &&
        matchesMonth &&
        matchesYear &&
        matchesPlatform &&
        matchesTag &&
        matchesRange &&
        matchesSemantic
      );
    });


    const handlePageChange = (page: number) => {
          const params = new URLSearchParams();

          if (selectedPlatform !== "All Platforms") params.set("platform", selectedPlatform);
          if (selectedTag !== "All" && selectedTag !== "")
            params.set("tag", selectedTag === "Other" ? customTag : selectedTag);
          if (selectedDay !== "All Days") params.set("day", selectedDay);
          if (selectedMonth !== "All Months") params.set("month", selectedMonth);
          if (selectedYear !== "All Years") params.set("year", selectedYear);
          if (selectedRange !== "All Time") params.set("range", selectedRange);

          params.set("page", page.toString());

          router.push(`/panel/prompts?${params.toString()}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
      };

    const start = (currentPages - 1) * promptsPerPage;
    const paginatedPrompts = filterPrompts.slice(start, start + promptsPerPage);  

  const updateURL = (filters: {
        day: string;
        platform: string;
        tag: string;
        month: string;
        year: string;
        range: string;
      }) => {
        const params = new URLSearchParams();

        if (filters.platform !== "All Platforms") params.set("platform", filters.platform);
        if (filters.tag !== "All" && filters.tag !== "") params.set("tag", filters.tag);
        if (filters.day !== "All Days") params.set("day", filters.day);
        if (filters.month !== "All Months") params.set("month", filters.month);
        if (filters.year !== "All Years") params.set("year", filters.year);
        if (filters.range !== "All Time") params.set("range", filters.range);

        params.set("page", "1");
        router.push(`/panel/prompts?${params.toString()}`);
    };

    const handleSemanticSearch = async () => {
      setLoading(true);
      setSemanticMode(true)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        console.log("Running semantic search for:", searchQuery);

        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, userId: user.id }),
        });

        const data = await res.json();
        console.log("Semantic search response:", data);
        if (!res.ok) throw new Error(data.error || "Failed to search");

        const ids = data.results.map((item: { id: string }) => item.id);
        setSemanticIds(ids);

        console.log("✅ Semantic Search Results:", data.results);
      } catch (err) {
        console.error("❌ Semantic search failed:", err);
      }
      setLoading(false);
      setSearchQuery(""); // Clear search query after search
    };

  useEffect(() => {
    
    const fetchAllPrompts = async () => {
      // const from = (page - 1) * promptsPerPage;
      // const to = from + promptsPerPage - 1;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id){
        setHasPrompts(false);
        setLoading(true);
        return;
      }

    const { data,  error } = await supabase
      .from("prompts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });


      if (error) {
      console.error("Error fetching prompts:", error);
      setLoading(false);
      return;
    }
    
    setPrompts(data);
    setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage));
    setLoading(false);
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
    const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;
      const { data, error } = await supabase
      .from("prompts")
      .select("tags")
      .eq("user_id", user.id);

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
    // setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage))

    
  }, [currentPages]);
  useEffect(() => {
    setTotalPages(Math.ceil(filterPrompts.length / promptsPerPage));
  }, [filterPrompts])

//   useEffect(() => {
//   if (!searchQuery.trim()) {
//     setSemanticMode(false); // Reset to normal mode if query is empty
//     return;
//   }

//   // Clear previous timer
//   if (typingTimeout) clearTimeout(typingTimeout);

//   // Start a new timer (1 second debounce)
//   const timeout = setTimeout(() => {
//     handleSemanticSearch(); // Call search after user stops typing
//   }, 1000);

//   setTypingTimeout(timeout);

//   return () => {
//     if (timeout) clearTimeout(timeout);
//   };
// }, [searchQuery]);
  // console.log("Prompts loaded:", prompts);
//   const years = useMemo(() => {
//   const allYears = prompts.map((p) =>
//     new Date(p.timestamp).getFullYear().toString()
//   );
//   return ["All Years", ...Array.from(new Set(allYears))];
// }, [prompts]);
  

    console.log("Filtered prompts:", filterPrompts);


  if (loading) {
    return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
    </div>
  );
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSemanticSearch(); // Trigger on Enter
        }}
        className="relative w-full max-w-4xl mx-auto mt-6"
      >
        <Input
          type="text"
          placeholder="Search prompts semantically..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent reload
              handleSemanticSearch(); // Trigger search
            }
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm pr-12" // Add padding-right for icon
        />

        {/* Search Icon Button */}
        <button
          type="button"
          onClick={handleSemanticSearch}
          disabled={loading || !searchQuery.trim()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-violet-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </button>
      </form>

      {/* Filters - Now Responsive */}
      <div className="w-full max-w-4xl mx-auto mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        <Select value={selectedDay} onValueChange={(v) =>{
           setSelectedDay(v);
           updateURL({
            day: v,
            platform: selectedPlatform,
            tag: selectedTag === "Other" ? customTag : selectedTag,
            month: selectedMonth,
            year: selectedYear,
            range: selectedRange,
        });; // Reset to first page on filter change
          }}>
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

        <Select value={selectedPlatform} onValueChange={(v) =>{
          setSelectedPlatform(v);
          updateURL({
            day: selectedDay,
            platform: v,
            tag: selectedTag === "Other" ? customTag : selectedTag,
            month: selectedMonth,
            year: selectedYear,
            range: selectedRange,
        });; // Reset to first page on filter change
        }}>
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
            updateURL({
              day: selectedDay,
              platform: selectedPlatform,
              tag: v === "Other" ? customTag : v,
              month: selectedMonth,
              year: selectedYear,
              range: selectedRange,
          });; // Reset to first page on filter change
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

        <Select value={selectedMonth} onValueChange={(v) =>{
          setSelectedMonth(v);
          updateURL({
            day: selectedDay,
            platform: selectedPlatform,
            tag: selectedTag === "Other" ? customTag : selectedTag,
            month: v,
            year: selectedYear,
            range: selectedRange,
          }); // Reset to first page on filter change
          }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={(v) =>{
          setSelectedYear(v)
          updateURL({
            day: selectedDay,
            platform: selectedPlatform,
            tag: selectedTag === "Other" ? customTag : selectedTag,
            month: selectedMonth,
            year: v,
            range: selectedRange,
          });}}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRange} onValueChange={(v) =>{
          setSelectedRange(v)
          updateURL({
            day: selectedDay,
            platform: selectedPlatform,
            tag: selectedTag === "Other" ? customTag : selectedTag,
            month: selectedMonth,
            year: selectedYear,
            range: v,
          });;}}>
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
      <div key={currentPages} className="grid grid-cols-1 gap-4 mt-10 pb-4">
        {loading || ( paginatedPrompts.length === 0 && prompts.length > 0) ? (
          <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
            No prompts found for selected filters.
          </p>
        ) : paginatedPrompts.length > 0 ? (
          paginatedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))
        ) : (
         <>
          {Array.from({ length: 6 }).map((_, i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center sm:justify-center items-center gap-2 mt-6 mb-4 px-2 min-w-fit">
          {/* Prev button */}
          <button
            onClick={() => handlePageChange(currentPages - 1)}
            disabled={currentPages === 1}
            className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap ${
              currentPages === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-violet-700 text-white hover:bg-violet-800"
            }`}
          >
            Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) =>
            page === 1 ||
            page === totalPages ||
            Math.abs(page - currentPages) <= 1
          )
          .map((page, index, arr) => (
            <span key={page}>
              {index > 0 && page - arr[index - 1] > 1 && (
                <span className="px-2 py-1 text-gray-400 select-none">…</span>
              )}
              <button
                onClick={() => handlePageChange(page)}
                className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap ${
                  page === currentPages
                    ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold shadow-sm"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {page}
              </button>
            </span>
        ))}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPages + 1)}
            disabled={currentPages === totalPages}
            className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap ${
              currentPages === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-violet-700 text-white hover:bg-violet-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
