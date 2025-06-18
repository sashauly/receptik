import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface RecipeCardSkeletonProps {
  viewMode: "grid" | "list";
}

export default function RecipeCardSkeleton({
  viewMode,
}: RecipeCardSkeletonProps) {
  return (
    <li
      className={cn("w-full", viewMode === "grid" ? "h-[320px]" : "h-[80px]")}
    >
      <Card
        className={cn(
          "relative w-full flex",
          viewMode === "list" ? "flex-row items-center" : "flex-col h-full",
          "overflow-hidden"
        )}
      >
        {/* Image Section */}
        <div
          className={cn(
            viewMode === "list"
              ? "w-[80px] h-[80px] flex-shrink-0"
              : "w-full h-[160px]",
            "relative overflow-hidden"
          )}
        >
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content Section */}
        <div
          className={cn(
            "flex flex-col",
            viewMode === "list"
              ? "flex-1 min-w-0 max-w-[70%] px-4 justify-center"
              : "flex-1 p-4 justify-between"
          )}
        >
          <div className="flex flex-col gap-2 min-w-0">
            {/* Title */}
            <Skeleton
              className={cn("h-6", viewMode === "list" ? "w-3/4" : "w-4/5")}
            />

            {/* Description (only in grid view) */}
            {viewMode === "grid" && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
          </div>

          {/* Time */}
          <div
            className={cn(
              "flex items-center gap-1",
              viewMode === "list" ? "mt-1" : "mt-auto"
            )}
          >
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
