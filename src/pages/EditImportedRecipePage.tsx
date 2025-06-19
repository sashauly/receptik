import RecipeForm from "@/components/RecipeForm";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import { Recipe } from "@/types/recipe";
import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Helper to get default values for missing fields
function getDefaultRecipe(): Partial<Recipe> {
  // You may want to use your schema or a helper for this
  return {
    name: "",
    servings: 4,
    prepTime: "PT0S",
    cookTime: "PT0S",
    keywords: [],
    images: [],
    ingredients: [{ id: uuidv4(), name: "", amount: null, unit: "piece" }],
    instructions: [""],
    author: "",
  };
}

const EditImportedRecipePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { originalRecipe, validValues, index } = (location.state || {}) as {
    originalRecipe: Record<string, unknown>;
    validValues: Partial<Recipe>;
    index: number;
  };

  // Merge valid values with defaults for missing/invalid fields
  const initialRecipe = { ...getDefaultRecipe(), ...validValues };

  const handleSave = (updatedRecipe: Recipe) => {
    // Pass the updated recipe and its index back to the import page
    navigate("/settings?importPreview=1", {
      state: { updatedRecipe, index },
    });
    toast.success(t("importRecipes.success", { count: 1 }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center"
        >
          <ChevronLeft />
          {t("common.back")}
        </Button>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Original Imported Object</h4>
        <pre className="bg-muted p-3 rounded overflow-x-auto text-xs max-h-64">
          {JSON.stringify(originalRecipe, null, 2)}
        </pre>
      </div>
      <RecipeForm
        initialRecipe={initialRecipe as Recipe}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditImportedRecipePage;
