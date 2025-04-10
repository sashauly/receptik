import { useEffect, useState } from "react";
import RecipeDetail from "@/components/RecipeDetail";
import RecipeFormModal from "@/components/RecipeFormModal";
import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import ShareRecipeDialog from "@/components/ShareRecipeDialog";
import type { Recipe } from "@/types/recipe";
import { useNavigate, useParams } from "react-router-dom";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useRecipes } from "@/hooks/useRecipes";
import { useTranslation } from "react-i18next";

export default function RecipeDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { isLoading, updateRecipe, deleteRecipe, getRecipeBySlug } =
    useRecipes();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!slug) return;
    setRecipe(getRecipeBySlug(slug));
  }, [slug, getRecipeBySlug]);

  const { getParam, updateParams } = useUrlParams();

  const navigate = useNavigate();

  // Get URL parameters
  const showEdit = getParam("edit") === "true";
  const showDelete = getParam("delete") === "true";
  const showShare = getParam("share") === "true";

  const handleEditRecipe = () => {
    updateParams({ edit: "true" });
  };

  const handleDeleteRecipe = () => {
    updateParams({ delete: "true" });
  };

  const handleShareRecipe = () => {
    updateParams({ share: "true" });
  };

  const handleCloseModals = () => {
    updateParams({
      edit: null,
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

  const handleSaveRecipe = async (updatedRecipe: Recipe) => {
    await updateRecipe(updatedRecipe.id, updatedRecipe);
    setRecipe(updatedRecipe);
    handleCloseModals();
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
    <div className="container mx-auto py-6 px-4 md:px-6">
      <RecipeDetail
        recipe={recipe}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        onShare={handleShareRecipe}
      />

      <RecipeFormModal
        recipe={recipe}
        isOpen={showEdit}
        onClose={handleCloseModals}
        onSave={handleSaveRecipe}
      />

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
