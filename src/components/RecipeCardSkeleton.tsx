import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeCardSkeletonProps {
  viewMode: "grid" | "list";
}

export default function RecipeCardSkeleton({
  viewMode,
}: RecipeCardSkeletonProps) {
  if (viewMode === "grid") {
    return <RecipeCardSkeletonGrid />;
  }
  return <RecipeCardSkeletonList />;
}

function RecipeCardSkeletonGrid() {
  return (
    <li className="w-full">
      <Card className="relative w-full flex flex-col">
        {/* Image Section */}
        <div className="w-full h-[160px] relative">
          <Skeleton className="w-full h-full" />
        </div>
        {/* Content Section */}
        <div className="flex flex-col p-4 justify-between">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Title */}
            <Skeleton className="h-6 w-4/5" />
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
        {/* More Actions Button */}
        <Skeleton className="absolute right-4 top-4 h-9 w-9 rounded-full" />
      </Card>
    </li>
  );
}

function RecipeCardSkeletonList() {
  return (
    <li className="w-full h-[80px]">
      <Card className="relative w-full flex flex-row items-center overflow-hidden h-full">
        {/* Image Section */}
        <div className="w-[80px] h-[80px] flex-shrink-0 relative overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
        {/* Content Section */}
        <div className="flex flex-col flex-1 min-w-0 max-w-[70%] px-4 justify-center">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Title */}
            <Skeleton className="h-6 w-3/4" />
          </div>
          {/* Time */}
          <div className="flex items-center gap-1 mt-1">
            <Skeleton className="h-4 w-4 flex-shrink-0" /> {/* Clock icon */}
            <Skeleton className="h-4 w-24" /> {/* Time text */}
          </div>
        </div>
        {/* More Actions Button */}
        <Skeleton className="absolute right-4 top-4 h-9 w-9 rounded-full" />
      </Card>
    </li>
  );
}
