import ErrorBoundary from "@/components/ErrorBoundary";
import { ContentLayout } from "@/components/layout/ContentLayout";
import RecipeForm from "@/components/RecipeForm";
import { useAddRecipe } from "@/hooks/recipes/useAddRecipe";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

function CreateRecipePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addRecipe, loading: addLoading, error: addError } = useAddRecipe();

  const handleAddRecipe = async (
    newRecipeData: Omit<Recipe, "id" | "slug" | "createdAt" | "updatedAt">
  ) => {
    try {
      const addedRecipe = await addRecipe(newRecipeData);

      navigate(`/recipes/${addedRecipe.slug}`);

      // TODO add translation
      toast.success("Recipe Created");
    } catch (e) {
      logError("Failed to create recipe", e);
      // TODO add translation
      toast.error("Failed to create recipe");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <ContentLayout title={t("forms.createRecipe")}>
      <ErrorBoundary componentName="RecipeForm">
        <RecipeForm
          initialRecipe={null}
          onSave={handleAddRecipe}
          onCancel={handleCancel}
        />
      </ErrorBoundary>
      {/* TODO: Add translation */}
      {addLoading && <p>Adding recipe...</p>}
      {addError && (
        <p className="text-destructive">
          Error adding recipe: {addError.message}
        </p>
      )}
    </ContentLayout>
  );
}

export default CreateRecipePage;
