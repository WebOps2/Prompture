// app/panel/trash/page.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Trash — Coming Soon",
};

export default function TrashPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
        <Construction className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-500 text-transparent bg-clip-text">
        Trash — Coming Soon
      </h1>

      <p className="mt-2 text-muted-foreground">
        We’re building a safe place to recover deleted prompts. Check back soon.
      </p>

      <div className="mt-6 flex justify-center">
        <Button asChild>
          <Link href="/panel/prompts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>
      </div>
    </main>
  );
}
