"use client";

import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7C3AED", "#06B6D4", "#F59E0B", "#EF4444", "#6B7280", "#10B981"];

export default function TagsPieChart() {
  const [tagData, setTagData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        // ✅ Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("No user found");
          setLoading(false);
          return;
        }

        // ✅ Fetch all tags from prompts
        const { data, error } = await supabase
          .from("prompts")
          .select("tags")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching tags:", error);
          setLoading(false);
          return;
        }

        // ✅ Count tag frequencies
        const tagCount: Record<string, number> = {};
        data.forEach((row) => {
          if (Array.isArray(row.tags)) {
            row.tags.forEach((tag) => {
              tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
          }
        });

        // ✅ Sort tags and split top 5 + others
        const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
        const topTags = sortedTags.slice(0, 5); // Top 5
        const othersCount = sortedTags.slice(5).reduce((sum, [, count]) => sum + count, 0);

        // ✅ Format data for Recharts
        const pieData = [
          ...topTags.map(([name, value]) => ({ name, value })),
          ...(othersCount > 0 ? [{ name: "Other", value: othersCount }] : []),
        ];

        setTagData(pieData);
      } catch (err) {
        console.error("Unexpected error fetching tags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTagData();
  }, []);

  if (loading) {
    return <div className="text-center">Loading chart...</div>;
  }

  if (tagData.length === 0) {
    return <div className="text-center text-gray-500">No tag data available</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center w-full max-w-full ">
      <h3 className="text-lg font-semibold mb-4">Categories Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={tagData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={false} // ✅ Removes clutter
            >
            {tagData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} uses`, `${name}`]} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center"  />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
