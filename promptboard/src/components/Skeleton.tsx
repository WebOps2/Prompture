import { Skeleton } from "@/components/ui/skeleton";

function PromptCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export default PromptCardSkeleton;
