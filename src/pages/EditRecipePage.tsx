import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/hooks/useRecipes";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const EditRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const recipeSlug = slug === "create" ? undefined : slug;

  const { updateRecipe, getRecipeBySlug } = useRecipes();

  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!recipeSlug) return;
    setRecipe(getRecipeBySlug(recipeSlug));
  }, [recipeSlug, getRecipeBySlug]);

  const handleEdit = async (updatedRecipe: Recipe) => {
    try {
      if (!recipe) {
        toast.error("Failed to edit recipe");
        return;
      }

      await updateRecipe(recipe.id, updatedRecipe);
      navigate(`/recipes/${updatedRecipe.slug}`);

      toast.success("Recipe Updated");
    } catch (e) {
      logError("Failed to edit recipe", e);
      toast.error("Failed to edit recipe");
    }
  };

  const handleBack = () => {
    navigate(`/recipes/${recipeSlug}`);
  };

  const handleCancel = () => {
    navigate(`/recipes/${recipeSlug}`);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft />
          Back
        </Button>
      </div>
      {recipe && (
        <RecipeForm
          initialRecipe={recipe}
          onSave={handleEdit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default EditRecipePage;
