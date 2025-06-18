// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to PromptBoard 👋</h1>
      <p className="text-muted-foreground text-lg">
        This is your central place to manage prompts, organize ideas, and track AI usage.
      </p>

      <div className="mt-6">
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-medium shadow transition">
          Install Chrome Extension
        </button>
      </div>
    </div>
  );
}
