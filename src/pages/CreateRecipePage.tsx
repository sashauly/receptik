import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { useRecipes } from "@/hooks/useRecipes";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();

  const handleSave = async (recipe: Recipe) => {
    try {
      await addRecipe(recipe);
      navigate(`/recipes/${recipe.slug}`);

      toast.success("Recipe Created");
    } catch (e) {
      logError("Failed to create recipe", e);
      toast.error("Failed to create recipe");
    }
  };

  const handleBack = () => {
    navigate(-1);
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
          Back
        </Button>
      </div>
      <RecipeForm
        initialRecipe={null}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CreateRecipePage;
