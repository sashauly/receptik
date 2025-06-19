import React from "react";
import RecipePreviewCard from "@/components/RecipePreviewCard";
import type { Recipe } from "@/types/recipe";

interface ImportRecipeCardProps {
  recipe: Recipe;
  index: number;
}

const ImportRecipeCard: React.FC<ImportRecipeCardProps> = ({
  recipe,
  index,
}) => {
  return (
    <div
      key={recipe.id || `preview-${index}`}
      role="listitem"
      className="rounded-lg border bg-background p-4 flex flex-col max-w-full min-w-0"
    >
      <RecipePreviewCard recipe={recipe} />
    </div>
  );
};

export default ImportRecipeCard;
