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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from 'react';

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
  const days = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
  const [selectedRange, setSelectedRange] = useState("All Time");

  const timeRanges = ["All Time", "Today", "This Week", "This Month"];
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const promptsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [currentPages, setCurrentPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Add refs to track navigation state
  const navigationRef = useRef(false);
  const lastPageRef = useRef(1);
  const isInitialLoadRef = useRef(true);

  // Detect Chrome browser
  const isChrome = typeof window !== 'undefined' && 
    /Chrome/.test(navigator.userAgent) && 
    /Google Inc/.test(navigator.vendor);

  // Handle page changes from URL with debouncing
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    // Prevent unnecessary updates
    if (page === currentPages && !isInitialLoadRef.current) {
      return;
    }
    
    // Add a small delay for Chrome to process navigation
    const timeoutId = setTimeout(() => {
      if (page !== currentPages) {
        setCurrentPages(page);
        lastPageRef.current = page;
      }
      isInitialLoadRef.current = false;
    }, isChrome ? 50 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchParams, pathname, currentPages]);

  // Filter prompts based on selected filters
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
  });

  // Chrome-optimized pagination handler
  const handlePageChange = useCallback((page: number) => {
    if (page === currentPages || navigationRef.current) return;
    
    navigationRef.current = true;
    
    // For Chrome, use a more aggressive approach
    if (isChrome) {
      // Force page reload for Chrome to ensure state consistency
      window.location.href = `${pathname}?page=${page}`;
    } else {
      // For other browsers, use the normal Next.js navigation
      router.replace(`${pathname}?page=${page}`);
      
      setTimeout(() => {
        navigationRef.current = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [currentPages, pathname, router, isChrome]);

  // Handle filter changes with Chrome optimization
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    // Reset navigation state
    navigationRef.current = true;
    
    // Update the filter state
    switch(filterType) {
      case 'day':
        setSelectedDay(value);
        break;
      case 'platform':
        setSelectedPlatform(value);
        break;
      case 'tag':
        setSelectedTag(value);
        if (value !== "Other") setCustomTag("");
        break;
      case 'month':
        setSelectedMonth(value);
        break;
      case 'year':
        setSelectedYear(value);
        break;
      case 'range':
        setSelectedRange(value);
        break;
    }
    
    // Navigate to page 1 with Chrome optimization
    setTimeout(() => {
      if (isChrome) {
        window.location.href = `${pathname}?page=1`;
      } else {
        router.replace(`${pathname}?page=1`);
        navigationRef.current = false;
      }
    }, 50);
  }, [pathname, router, isChrome]);

  // Calculate paginated prompts
  const start = (currentPages - 1) * promptsPerPage;
  const paginatedPrompts = filterPrompts.slice(start, start + promptsPerPage);

  // Main data fetching effect
  useEffect(() => {
    const fetchAllPrompts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("prompts")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching prompts:", error);
        return;
      }
      
      setPrompts(data);
    };

    const loadPromptDateMetadata = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("timestamp")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("❌ Failed to load timestamps:", error);
      } else {
        const uniqueYears = Array.from(new Set(data.map((p) => new Date(p.timestamp).getFullYear().toString())));
        setYears(["All Years", ...uniqueYears]);
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
      } else {
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
        .limit(1);

      if (error) {
        console.error("Error fetching prompts", error);
        setLoading(false);
        return;
      }

      setHasPrompts(data.length > 0);
      setLoading(false);
    };

    fetchAllPrompts();
    fetchPlatforms();
    fetchPrompts();
    loadPromptDateMetadata();
    fetchTags();
  }, []);

  // Update total pages when filters change
  useEffect(() => {
    const newTotalPages = Math.ceil(filterPrompts.length / promptsPerPage);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is beyond available pages
    if (currentPages > newTotalPages && newTotalPages > 0) {
      handlePageChange(1);
    }
  }, [filterPrompts, currentPages, handlePageChange]);

  // Add Chrome-specific event listeners
  useEffect(() => {
    if (!isChrome) return;

    const handleBeforeUnload = () => {
      navigationRef.current = false;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        navigationRef.current = false;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isChrome]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }

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
        <Select value={selectedDay} onValueChange={(v) => handleFilterChange('day', v)}>
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

        <Select value={selectedPlatform} onValueChange={(v) => handleFilterChange('platform', v)}>
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
          <Select value={selectedTag} onValueChange={(v) => handleFilterChange('tag', v)}>
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

        <Select value={selectedMonth} onValueChange={(v) => handleFilterChange('month', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={(v) => handleFilterChange('year', v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRange} onValueChange={(v) => handleFilterChange('range', v)}>
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

      {/* Prompts Grid */}
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

      {/* Pagination */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center sm:justify-center items-center gap-2 mt-6 mb-4 px-2 min-w-fit">
          {/* Prev button */}
          <button
            onClick={() => handlePageChange(currentPages - 1)}
            disabled={currentPages === 1}
            className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap transition-all ${
              currentPages === 1 || navigationRef.current
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
                  // disabled={navigationRef.current}
                 className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap transition-all ${
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
            className={`text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded whitespace-nowrap transition-all ${
              currentPages === totalPages || navigationRef.current
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-violet-700 text-white hover:bg-violet-800"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Chrome Debug Info (remove in production) */}
      {isChrome && (
        <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
          Chrome detected - Using optimized navigation | Current: {currentPages} | Total: {totalPages}
        </div>
      )}
    </div>
  );
}