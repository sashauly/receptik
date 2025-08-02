import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";
import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import SearchInput from "@/components/SearchInput";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { ViewModeControls } from "@/components/ViewModeControls";
import { logError } from "@/utils/logger";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { RecipeListLoading } from "@/components/RecipeListLoading"; // Import the new component

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

  const isRecipesLoading = recipes === undefined;

  const mainContent = (
    <ErrorBoundary componentName="RecipeList">
      {isRecipesLoading ? (
        <RecipeListLoading />
      ) : (
        <RecipeList
          recipes={recipes}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          searchTerm={currentSearchTerm}
          onClearSearch={() => setCurrentSearchTerm("")}
        />
      )}
    </ErrorBoundary>
  );

  const dialogs = (
    <>
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
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Fixed Top Bar */}
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

        {/* Mobile Main Content */}
        <main className="w-full flex-1 overflow-y-auto p-4 space-y-4 mt-[72px]">
          {mainContent}
        </main>
        {dialogs}
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <ContentLayout title="Receptik">{mainContent}</ContentLayout>
      {dialogs}
    </>
  );
}
