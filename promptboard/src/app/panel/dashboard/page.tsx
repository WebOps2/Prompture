'use client';

import EmptyDashBoard from '@/app/EmptyDashboard';
import DashboardPromptCard from '@/components/DashBoardPromptCard';
import { supabase } from '@/lib/supabase-client';
import { BookOpen, Star, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Prompt {
  id: string;
  Title: string;
  prompt: string;
  source: string;
  tags: string[];
  timestamp: string;
  favorite: boolean;
}
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [hasPrompts, setHasPrompts] = useState(false);
  const [total, setTotal] = useState(0);
  const [usedToday, setUsedToday] = useState(0);
  const [favorites, setFavorites] = useState(0);
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const {data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No user found");
        setLoading(false);
        return;
      }
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
// Start of today in UTC
      const startUTC = startOfDay.toISOString(); // beginning of your local day
      const endUTC = endOfDay.toISOString(); // end of your local day

      const { data, count: total, error } = await supabase
      .from("prompts")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

      console.log("Data length:", data?.length);
      console.log("Count:", total);

      if (error) {
        console.error("❌ Error fetching prompt count:", error);
        return 0;
      }

      const { count: totalToday, error:errToday } = await supabase
      .from("prompts")
      .select('*', { count: 'exact' })
      .gte("timestamp", startUTC) // Start of today in UTC
      .lte("timestamp", endUTC) // End of today in UTC
      .eq("user_id", user.id); // Ensure we only count today's prompts for the
      
      // console.log("Total prompts today:", todayStr, totalToday);

        if (errToday) {
          console.error("❌ Error fetching today's prompts:", errToday.message);
        } else {
          setUsedToday(totalToday || 0); // Or whatever state updater you're using
        }

        // Fetch favorites
      const { count: totalFav, error:errFav } = await supabase
          .from("prompts")
          .select("*", {
            count: "exact",
            head: true
          })
          .eq("favorite", true)
          .eq("user_id", user.id); // Ensure we only count the user's favorites
           // Only count favorited prompts

        if (errFav) {
          console.error("❌ Error fetching favorites:", errFav.message);
        } else {
          setFavorites(totalFav || 0); // Or whatever state updater you're using
        }
      setTotal(total || 0);
    }
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
    const fetchRecentPrompts = async () => {
      const {data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data: recentPrompts, error } = await supabase
      .from('prompts')
      .select('id, Title, prompt, source, tags, timestamp, favorite')
      .eq('user_id', user.id) // Only fetch for the logged-in user
      .order('timestamp', { ascending: false }) // Most recent first
      .limit(5); // Only 5 prompts



    if (error) {
      console.error("❌ Error fetching recent prompts:", error.message);
    } else {
      console.log("✅ Recent Prompts:", recentPrompts);
      setRecentPrompts(recentPrompts || []);
    }
    }
    fetchRecentPrompts();
    fetchPrompts();
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!hasPrompts) {
    return <EmptyDashBoard />;
  }
  console.log("User has prompts:", hasPrompts);
  // ✅ Inline Hello World view if user has prompts
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {/* Total Prompts */}
        <div className="border bg-white rounded-xl p-4 flex items-start justify-between hover:scale-[1.02] transition-transform shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Prompts</p>
            <p className="text-2xl font-semibold text-black">{total}</p>
          </div>
          <div className="text-muted-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Used Today */}
        <div className="border bg-white rounded-xl p-4 flex items-start justify-between hover:scale-[1.02] transition-transform shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Used Today</p>
            <p className="text-2xl font-semibold text-black">{usedToday}</p>
            <p className="text-xs text-muted-foreground mt-1">+3 from yesterday</p>
          </div>
          <div className="text-muted-foreground">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        {/* Favorites */}
        <div className="border bg-white rounded-xl p-4 flex items-start justify-between hover:scale-[1.02] transition-transform shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Favorites</p>
            <p className="text-2xl font-semibold text-black">{favorites}</p>
          </div>
          <div className="text-muted-foreground">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>
      <section className='mt-10 w-full'>
        <div className="flex justify-between items-center mb-6 w-full">
            <h2 className="text-2xl font-bold text-gray-900">Recent Prompts</h2>
            <a
              href="/panel/prompts"
              className="text-purple-600 hover:underline text-sm font-medium"
            >
              View All →
            </a>
          </div>
          {/* Cards Container */}
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {recentPrompts.map((prompt) => (
              <DashboardPromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.Title || 'Untitled Prompt'}
                prompt={prompt.prompt}
                source={prompt.source || 'Unknown Source'}
                tags={prompt.tags || []}
                timestamp={new Date(prompt.timestamp).toLocaleDateString()}
                favorite={prompt.favorite || false}
              />
            ))}
          </div>
      </section>
    </>
   
  );
}
