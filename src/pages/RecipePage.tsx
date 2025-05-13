import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeDetail from "@/components/RecipeDetail";
import ShareRecipeDialog from "@/components/ShareRecipeDialog";
import { useRecipes } from "@/hooks/useRecipes";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

export default function RecipePage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const recipeSlug = slug === "create" ? undefined : slug;
  const { getParam, updateParams } = useUrlParams();

  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const { isLoading, deleteRecipe, getRecipeBySlug } =
    useRecipes();

  useEffect(() => {
    if (!recipeSlug) return;
    setRecipe(getRecipeBySlug(recipeSlug));
  }, [recipeSlug, getRecipeBySlug]);

  const showDelete = getParam("delete") === "true";
  const showShare = getParam("share") === "true";

  const handleEditRecipe = () => {
    navigate(`/recipes/${recipeSlug}/edit`);
  };

  const handleDeleteRecipe = () => {
    updateParams({ delete: "true" });
  };

  const handleShareRecipe = () => {
    updateParams({ share: "true" });
  };

  const handleCloseModals = () => {
    updateParams({
      delete: null,
      share: null,
    });
  };

  const confirmDeleteRecipe = async () => {
    if (recipe) {
      await deleteRecipe(recipe.id);
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        {t("common.loading")}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">{t("recipe.recipeNotFound")}</h3>
          <p className="text-muted-foreground">
            {t("recipe.recipeNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      {recipe && (
        <RecipeDetail
          recipe={recipe}
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
          onShare={handleShareRecipe}
        />
      )}

      <DeleteRecipeDialog
        recipe={recipe}
        isOpen={showDelete}
        onClose={handleCloseModals}
        onConfirm={confirmDeleteRecipe}
      />

      <ShareRecipeDialog
        recipe={recipe}
        isOpen={showShare}
        onClose={handleCloseModals}
      />
    </div>
  );
}
