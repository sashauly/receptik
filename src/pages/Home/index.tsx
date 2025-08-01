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

import { logError } from "@/lib/utils/logger";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { ContentLayout } from "@/components/layout/ContentLayout";

export default function Home() {
  const navigate = useNavigate();
  const { getParam, updateParams } = useUrlParams();

  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(currentSearchTerm, 300);

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes({ searchTerm: debouncedSearchTerm });

  const {
    deleteRecipe,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();
  const deleteRecipeId = getParam("delete");
  const {
    recipe: recipeToDelete,
    loading: recipeToDeleteLoading,
    error: recipeToDeleteError,
  } = useRecipe({ id: deleteRecipeId || undefined });

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
          {/* {currentSearchTerm && (
              <p className="text-sm text-muted-foreground">
                {t("recipe.searchResults", { count: recipes.length })}
              </p>
            )} */}
        </div>

        {/* Mobile Main Content */}
        <main className="w-full flex-1 overflow-y-auto p-4 space-y-4 mt-[72px]">
          <ErrorBoundary componentName="RecipeList">
            <RecipeList
              recipes={recipes}
              isLoading={recipesLoading}
              error={recipesError}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              searchTerm={currentSearchTerm}
              onClearSearch={() => setCurrentSearchTerm("")}
            />
          </ErrorBoundary>
        </main>

        <ErrorBoundary componentName="DeleteRecipeDialog">
          <DeleteRecipeDialog
            recipeToDelete={recipeToDelete}
            isLoading={deleteLoading || recipeToDeleteLoading}
            error={deleteError}
            isOpen={!!deleteRecipeId}
            onClose={handleCloseModals}
            onConfirm={confirmDeleteRecipe}
          />
        </ErrorBoundary>
      </>
    );
  } else {
    // Desktop Layout
    return (
      <>
        <ContentLayout title="Receptik">
          {recipesError && recipes.length === 0 && (
            <p className="text-destructive">
              {(recipesError as Error).message}
            </p>
          )}

          <ErrorBoundary componentName="RecipeList">
            <RecipeList
              recipes={recipes}
              isLoading={recipesLoading}
              error={recipesError}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              searchTerm={currentSearchTerm}
              onClearSearch={() => setCurrentSearchTerm("")}
            />
          </ErrorBoundary>
        </ContentLayout>
        <ErrorBoundary componentName="DeleteRecipeDialog">
          <DeleteRecipeDialog
            recipeToDelete={recipeToDelete}
            isLoading={deleteLoading || recipeToDeleteLoading}
            error={recipeToDeleteError || deleteError}
            isOpen={!!recipeToDelete}
            onClose={handleCloseModals}
            onConfirm={confirmDeleteRecipe}
          />
        </ErrorBoundary>
      </>
    );
  }
}
