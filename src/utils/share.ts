import type { Recipe, Ingredient } from "@/types/recipe";
import { TFunction } from "i18next";
import { formatDuration } from "./time";
import { getBaseUnitByValue } from "./measurements";

const formatIngredientText = (i: Ingredient, t: TFunction) => {
  const baseUnit = getBaseUnitByValue(i.unit);
  const unitType = baseUnit?.type || "other";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unitLabel = t(`units.${unitType}.${i.unit}` as any);
  if (i.amount === null || i.amount === undefined)
    return `${i.name} (${unitLabel})`;
  return `${i.name}: ${i.amount} ${unitLabel}`;
};

export const generateRecipeText = (recipe: Recipe, t: TFunction): string => {
  return `
📖 ${recipe.name.toUpperCase()}
${recipe.description ? `\n${recipe.description}\n` : ""}
⏱️ ${t("recipe.prepTime")}: ${formatDuration(recipe.prepTime ?? "PT0S", t)}
🔥 ${t("recipe.cookTime")}: ${formatDuration(recipe.cookTime, t)}
🍽️ ${t("recipe.servings")}: ${recipe.servings}

🛒 ${t("recipe.ingredients").toUpperCase()}:
${recipe.ingredients.map((i) => `• ${formatIngredientText(i, t)}`).join("\n")}

👨‍🍳 ${t("recipe.instructions").toUpperCase()}:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n\n")}
`.trim();
};

export const shareRecipeAsText = async (recipe: Recipe, t: TFunction) => {
  const fullText = generateRecipeText(recipe, t);

  if (navigator.share) {
    try {
      await navigator.share({
        title: recipe.name,
        text: fullText,
        url: window.location.href,
      });
      return "shared";
    } catch (error) {
      if ((error as Error).name === "AbortError") return "cancelled";
      console.error("Share failed", error);
    }
  }

  try {
    await navigator.clipboard.writeText(fullText);
    return "copied";
  } catch (err) {
    console.error("Clipboard failed", err);
    return "failed";
  }
};
