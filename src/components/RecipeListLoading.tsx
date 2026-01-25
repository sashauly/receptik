import ErrorBoundary from "@/components/ErrorBoundary";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { useSettings } from "@/context/SettingsContext";

export function RecipeListLoading() {
  const { viewMode } = useSettings().settings;

  return (
    <div className="space-y-4 w-full shrink-0">
      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <ErrorBoundary componentName="RecipeCardSkeleton" key={index}>
            <RecipeCardSkeleton viewMode={viewMode} />
          </ErrorBoundary>
        ))}
      </ul>
    </div>
  );
}
