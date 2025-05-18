import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { useAddRecipe } from "@/hooks/recipes/useAddRecipe";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateRecipePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addRecipe, loading: addLoading, error: addError } = useAddRecipe();

  const handleAddRecipe = async (
    newRecipeData: Omit<Recipe, "id" | "slug" | "dateCreated" | "dateModified">
  ) => {
    try {
      const addedRecipe = await addRecipe(newRecipeData);

      navigate(`/recipes/${addedRecipe.slug}`);

      toast.success("Recipe Created");
    } catch (e) {
      logError("Failed to create recipe", e);
      toast.error("Failed to create recipe");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="fflex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft />
          {t("common.back")}
        </Button>
      </div>
      <RecipeForm
        initialRecipe={null}
        onSave={handleAddRecipe}
        onCancel={handleCancel}
      />
      {addLoading && <p>Adding recipe...</p>}
      {addError && (
        <p className="text-destructive">
          Error adding recipe: {addError.message}
        </p>
      )}
    </div>
  );
};

export default CreateRecipePage;
