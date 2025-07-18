import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function BarChartComponent() {
    // const [data, setData] = useState<{ platform: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const fetchPromptsPerPlatform = async () => {
          const {data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            console.error("No user found");
            setLoading(false);
            return;
          }
    
          const { data, error } = await supabase
            .from('prompts')
            .select('source')
            .eq('user_id', user.id)
          
    
          console.log("Prompts per platform:", data);
          if (error) {
            console.error("Error fetching prompts per platform", error);
            return [];
          }
    
          const platformCount: Record<string, number> = {};
          data.forEach((row) => {
            if (row.source) {
              platformCount[row.source] = (platformCount[row.source] || 0) + 1;
            }
          });
          console.log("Prompts per platform:", platformCount);
    
          return Object.entries(platformCount).map(([platform, count]) => ({
              platform,
              count,
            }));
    
        }
        const [platformData, setPlatformData] = useState<{ platform: string; count: number }[]>([]);
        useEffect(() => {
          const loadData = async () => {
            const platforms = await fetchPromptsPerPlatform();
            if (platforms) {
              setPlatformData(platforms);
            }
            setLoading(false);
          };
          loadData();
        }, []);


        return (
            <section className="mt-10 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                    {/* Bar Chart for Platforms */}
                    <div className="bg-white">
                        <h3 className="text-lg font-semibold mb-4">Prompts per Platform</h3>
                        <ResponsiveContainer width={200} height={300}>
                            <BarChart data={platformData}>
                            <XAxis dataKey="platform" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        )
}