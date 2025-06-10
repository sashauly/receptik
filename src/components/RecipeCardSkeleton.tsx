import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeCardSkeleton() {
  return (
    <li className="h-full">
      <Card className="overflow-hidden shadow-sm border h-full flex flex-col">
        <CardContent className="p-4 flex-grow space-y-3">
          {/* Title */}
          <Skeleton className="h-6 w-3/4 rounded" />

          {/* Keywords/Badges */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Time & Servings */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24 rounded" /> {/* For time */}
            <Skeleton className="h-4 w-28 rounded" /> {/* For servings */}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 justify-end p-4 border-t">
          {/* Dropdown Button */}
          <Skeleton className="h-9 w-9 rounded-full" />
        </CardFooter>
      </Card>
    </li>
  );
}
