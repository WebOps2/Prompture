"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import { Download } from "lucide-react";

export default function ExportDataSection() {
  const handleExport = async (format: "json" | "csv") => {
    // Fetch user's prompts
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("No user found");
      return;
    }

    const { data, error } = await supabase
      .from("prompts")
      .select("id, Title, prompt, source, tags, timestamp, favorite")
      .eq("user_id", user.id);

    if (error || !data) {
      alert("Failed to export data");
      return;
    }

    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      downloadFile(blob, "prompts.json");
    } else if (format === "csv") {
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      downloadFile(blob, "prompts.csv");
    }
  };

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0] || {}).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [headers, ...rows].join("\n");
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
      <p className="text-sm text-gray-500 mb-6">
        Download your prompts and data in various formats.
      </p>

      <div className="flex gap-4">
        {/* JSON Export */}
        <Button
          variant="outline"
          onClick={() => handleExport("json")}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export as JSON
        </Button>

        {/* CSV Export */}
        <Button
          variant="outline"
          onClick={() => handleExport("csv")}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export as CSV
        </Button>
      </div>
    </div>
  );
}
