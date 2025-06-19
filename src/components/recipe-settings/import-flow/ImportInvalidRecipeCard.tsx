import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Recipe } from "@/types/recipe";

interface Invalid {
  index: number;
  errors: Record<string, string>;
  validValues: Partial<Recipe>;
}

interface ImportInvalidRecipeCardProps {
  index: number;
  invalid: Invalid;
  recipe: Recipe;
  onEdit: (
    originalRecipe: Recipe,
    validValues: Partial<Recipe>,
    index: number
  ) => void;
}

const ImportInvalidRecipeCard: React.FC<ImportInvalidRecipeCardProps> = ({
  index,
  invalid,
  recipe,
  onEdit,
}) => {
  const { t } = useTranslation();
  return (
    <div
      key={`invalid-${index}`}
      role="listitem"
      className="border border-destructive bg-destructive/10 rounded-lg p-4 flex flex-col max-w-full min-w-0"
    >
      <div className="font-semibold text-destructive mb-1">
        {t("importRecipes.invalidRecipeTitle", {
          num: index + 1,
          defaultValue: `Recipe #${index + 1}`,
        })}
      </div>
      <ul className="ml-4 list-disc text-destructive text-sm mt-2 flex flex-col gap-1 items-start">
        {Object.entries(invalid.errors).map(([field, message]) => (
          <li key={field} className="flex gap-2 items-center">
            <span className="font-semibold">{field}:</span>
            <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
            <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
              {message}
            </span>
          </li>
        ))}
      </ul>
      <Button
        className="mt-2"
        variant="outline"
        onClick={() => onEdit(recipe, invalid.validValues, index)}
      >
        {t("common.edit")}
      </Button>
    </div>
  );
};

export default ImportInvalidRecipeCard;
