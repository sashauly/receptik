import { ContentLayout } from "@/components/layout/ContentLayout";
import RecipeForm from "@/components/RecipeForm";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useUpdateRecipe } from "@/hooks/recipes/useUpdateRecipe";
import { logError } from "@/utils/logger";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { UpdateArgs } from "@/data/recipeService";

function EditRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const recipeSlug = slug === "create" ? undefined : slug;

  const { recipe } = useRecipe({ slug: recipeSlug });

  const {
    updateRecipe,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateRecipe();

  const handleUpdateRecipe = async (
    updatedRecipeData: UpdateArgs["updates"],
  ) => {
    try {
      if (!recipe) {
        toast.error("Failed to edit recipe");
        return;
      }
      const updatedRecipe = await updateRecipe({
        id: recipe?.id,
        updates: updatedRecipeData,
      });
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
