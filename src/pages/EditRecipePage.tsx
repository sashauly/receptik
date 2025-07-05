import { ContentLayout } from "@/components/layout/ContentLayout";
import RecipeForm from "@/components/RecipeForm";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useUpdateRecipe } from "@/hooks/recipes/useUpdateRecipe";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

function EditRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const recipeSlug = slug === "create" ? undefined : slug;

  const {
    recipe,
    loading: recipeLoading,
    error: recipeError,
  } = useRecipe({ slug: recipeSlug });

  const {
    updateRecipe,
    loading: updateLoading,
    error: updateError,
  } = useUpdateRecipe();

  const handleUpdateRecipe = async (
    updatedRecipeData: Omit<Recipe, "createdAt" | "updatedAt">
  ) => {
    try {
      if (!recipe) {
        toast.error("Failed to edit recipe");
        return;
      }
      const updatedRecipe = await updateRecipe(recipe?.id, updatedRecipeData);
      if (!updatedRecipe) {
        toast.error("Failed to update recipe");
        return;
      }
      navigate(`/recipes/${updatedRecipe.slug}`);

      // TODO add translation
      toast.success("Recipe Updated");
    } catch (err) {
      logError("Failed to update recipe", err);
      // TODO add translation
      toast.error("Failed to update recipe");
    }
  };

  const handleCancel = () => {
    navigate(`/recipes/${recipeSlug}`);
  };

  return (
    <ContentLayout title={t("forms.editRecipe")}>
      {recipeError && <p className="text-destructive">{recipeError.message}</p>}

      {recipeLoading && <p>{t("common.loading")}</p>}

      {recipe && (
        <RecipeForm
          initialRecipe={recipe}
          onSave={handleUpdateRecipe}
          onCancel={handleCancel}
        />
      )}
      {updateLoading && <p>{t("common.loading")}</p>}
      {updateError && (
        <p className="text-destructive">
          Error updating recipe: {updateError.message}
        </p>
      )}
    </ContentLayout>
  );
}

export default EditRecipePage;
