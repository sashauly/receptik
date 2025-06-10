import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";
import { logError } from "@/lib/utils/logger";
import { PlusCircle, Settings } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

export default function Home() {
  const { t } = useTranslation();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes();

  const {
    deleteRecipe,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();

  const { getParam, updateParams } = useUrlParams();
  const navigate = useNavigate();

  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  const deleteRecipeId = getParam("delete");

  const {
    recipe: recipeToDelete,
    loading: recipeToDeleteLoading,
    error: recipeToDeleteError,
  } = useRecipe({ id: deleteRecipeId || undefined });

  const handleCloseModals = useCallback(() => {
    updateParams({
      delete: null,
      share: null,
    });
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
    handleCloseModals();
    try {
      if (deleteRecipeId) {
        await deleteRecipe(deleteRecipeId);
      }
    } catch (error) {
      logError("Failed to confirm delete:", error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-2">
      {isSmallDevice ? (
        <>
          <div className="flex items-center justify-end gap-2 mb-4">
            <div className="flex items-center space-x-2">
              <Button asChild size="icon" className="add-recipe-button">
                <Link to="/recipes/create" title={t("common.addRecipe")}>
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="icon"
                className="settings-button"
              >
                <Link to="/settings" title={t("settings.title")}>
                  <Settings />
                </Link>
              </Button>
            </div>
          </div>

          <RecipeList
            recipes={recipes}
            isLoading={recipesLoading}
            error={recipesError}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        </>
      ) : (
        // Desktop
        <div className="space-y-4">
          {recipesError && (
            <p className="text-destructive">
              {(recipesError as Error).message}
            </p>
          )}

          <RecipeList
            recipes={recipes}
            isLoading={recipesLoading}
            error={recipesError}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        </div>
      )}

      <DeleteRecipeDialog
        recipeToDelete={recipeToDelete}
        isLoading={deleteLoading || recipeToDeleteLoading}
        error={recipeToDeleteError || deleteError}
        isOpen={!!recipeToDelete}
        onClose={handleCloseModals}
        onConfirm={confirmDeleteRecipe}
      />
    </div>
  );
}
