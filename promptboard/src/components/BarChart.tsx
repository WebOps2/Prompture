import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PlatformRow = { platform: string; count: number };
type PlatformResp = { total_platforms: number; rows: PlatformRow[] };

export default function BarChartComponent() {
  const [platformData, setPlatformData] = useState<PlatformRow[]>([]);
  const [totalPlatforms, setTotalPlatforms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) {
        console.error("No user found");
        setLoading(false);
        return;
      }

      const { data: rpcData, error } = await supabase.rpc(
        "get_platform_counts_json",
        { p_user_id: user.id }
      );

      if (error) {
        console.error("Error fetching platform counts via RPC:", error);
        setLoading(false);
        return;
      }

      const { rows, total_platforms } = (rpcData ?? {}) as PlatformResp;
      setPlatformData(rows ?? []);
      setTotalPlatforms(total_platforms ?? 0);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-center">Loading chart...</div>;

  return (
    <section className="mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="mb-3 text-sm text-zinc-600">
        {/* unique platforms, not capped by 1k */}
        {totalPlatforms} platforms
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        <div className="bg-white">
          <h3 className="text-lg font-semibold mb-4">Prompts per Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#7C3AED" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
