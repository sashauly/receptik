import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ContentLayout } from "@/components/layout/ContentLayout";
import RecipeList from "@/components/RecipeList";
import { RecipeListLoading } from "@/components/RecipeListLoading";
import SearchInput from "@/components/SearchInput";
import { ViewModeControls } from "@/components/ViewModeControls";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useDebounce } from "@/hooks/useDebounce";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";
import { cn } from "@/lib/utils";
import { logError } from "@/utils/logger";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const SKELETON_DELAY_MS = 200;

export default function Home() {
  const navigate = useNavigate();
  const { getParam, updateParams } = useUrlParams();

  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(currentSearchTerm, 300);

  const { recipes } = useRecipes({ searchTerm: debouncedSearchTerm });

  const {
    deleteRecipe,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();
  const deleteRecipeId = getParam("delete");

  const { recipe: recipeToDelete } = useRecipe({
    id: deleteRecipeId || undefined,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const isRecipesLoading = recipes === undefined;
  const [showSkeletons, setShowSkeletons] = useState(false);
  const skeletonDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!isRecipesLoading && showSkeletons) {
    setShowSkeletons(false);
  }

  useEffect(() => {
    if (isRecipesLoading && !showSkeletons) {
      skeletonDelayRef.current = setTimeout(() => {
        setShowSkeletons(true);
      }, SKELETON_DELAY_MS);
    }

    return () => {
      if (skeletonDelayRef.current) {
        clearTimeout(skeletonDelayRef.current);
        skeletonDelayRef.current = null;
      }
    };
  }, [isRecipesLoading, showSkeletons]);

  const shouldDisplaySkeletons = isRecipesLoading && showSkeletons;

  const handleCloseModals = useCallback(() => {
    updateParams({ delete: null, share: null });
  }, [updateParams]);

  const handleEditRecipe = useCallback(
    (recipeSlug: string) => {
      navigate(`/recipes/${recipeSlug}/edit`);
    },
    [navigate]
  );

  const handleDeleteRecipe = useCallback(
    (recipeId: string) => {
      updateParams({ delete: recipeId });
    },
    [updateParams]
  );

  const confirmDeleteRecipe = async () => {
    if (deleteRecipeId) {
      handleCloseModals();
      try {
        await deleteRecipe(deleteRecipeId);
      } catch (error) {
        logError("Failed to confirm delete:", error);
      }
    }
  };

  const recipesError = new Error(
    "An error occurred while fetching your recipes. Please try again later."
  );

  if (recipes === null) {
    return (
      <ContentLayout title="Receptik">
        <p className="text-destructive">{recipesError.message}</p>
      </ContentLayout>
    );
  }

  const mainContent = (
    <ErrorBoundary componentName="RecipeList">
      {shouldDisplaySkeletons ? (
        <RecipeListLoading />
      ) : !isRecipesLoading ? (
        <RecipeList
          recipes={recipes}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          searchTerm={currentSearchTerm}
          onClearSearch={() => setCurrentSearchTerm("")}
        />
      ) : null}
    </ErrorBoundary>
  );

  const dialogs = (
    <ErrorBoundary componentName="DeleteRecipeDialog">
      <DeleteRecipeDialog
        recipeToDelete={recipeToDelete}
        isLoading={deleteLoading}
        error={deleteError}
        isOpen={!!deleteRecipeId}
        onClose={handleCloseModals}
        onConfirm={confirmDeleteRecipe}
      />
    </ErrorBoundary>
  );

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            "fixed top-0 left-0 right-0 z-50",
            "flex flex-col gap-2 py-2 px-4",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
          )}
        >
          <div className="flex items-center gap-2">
            <SearchInput
              value={currentSearchTerm}
              onChange={setCurrentSearchTerm}
              className="flex-1"
            />
            <ViewModeControls />
          </div>
        </div>

        <main className="w-full flex-1 overflow-y-auto p-4 space-y-4 mt-[72px]">
          {mainContent}
        </main>
        {dialogs}
      </>
    );
  }

  return (
    <>
      <ContentLayout title="Receptik">{mainContent}</ContentLayout>
      {dialogs}
    </>
  );
}
