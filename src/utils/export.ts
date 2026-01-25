/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Ingredient, Recipe } from "@/types/recipe";
import { getBaseUnitByValue } from "@/utils/measurements";
import { formatDuration } from "@/utils/time";
import type { TFunction } from "i18next";

export const formatIngredient = (i: Ingredient, t: TFunction): string => {
  const baseUnit = getBaseUnitByValue(i.unit);
  const unitType = baseUnit?.type || "other";

  const translationKey = `units.${unitType}.${i.unit}` as any;
  const unitLabel = t(translationKey);
  if (i.amount === null || i.amount === undefined)
    return `${i.name} (${unitLabel})`;
  return `${i.name}: ${i.amount} ${unitLabel}`;
};

export const exportAsJson = async (recipe: Recipe) => {
  try {
    const data = JSON.stringify(recipe);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.slug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(`Failed to export as JSON. Please try again. ${error}`);
  }
};

export function base64ToBlob(base64: string, mimeType: string): Blob | null {
  try {
    if (
      typeof base64 !== "string" ||
      !base64.startsWith("data:") ||
      !base64.includes(",")
    ) {
      return null;
    }
    const parts = base64.split(",");
    if (parts.length < 2) return null;
    const byteString = atob(parts[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  } catch {
    return null;
  }
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const exportAllRecipesAsJson = async (recipes: Recipe[]) => {
  try {
    if (!recipes || recipes.length === 0) {
      throw new Error("No saved recipes found.");
    }

    const recipesWithBase64Images = await Promise.all(
      recipes.map(async (recipe) => {
        if (!recipe.images || recipe.images.length === 0) return recipe;
        const images = await Promise.all(
          recipe.images.map(async (img) => {
            const base64 = await blobToBase64(img.data);
            return {
              ...img,
              data: base64,
            };
          }),
        );
        return { ...recipe, images };
      }),
    );

    const data = JSON.stringify(recipesWithBase64Images);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "receptik.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(`Failed to export all recipes. ${error} Please try again.`);
  }
};

export const exportAsTxt = async (recipe: Recipe, t: TFunction) => {
  try {
    const text = `
${recipe.name.toUpperCase()}
${recipe.description || ""}

${t("recipe.prepTime")}: ${formatDuration(recipe.prepTime ?? "PT0S", t)}
${t("recipe.cookTime")}: ${formatDuration(recipe.cookTime, t)}
${t("recipe.servings")}: ${recipe.servings}
${recipe.keywords?.length ? `${t("recipe.keywords")}: ${recipe.keywords.join(", ")}` : ""}
------------------------------------------
${t("recipe.ingredients").toUpperCase()}:
${recipe.ingredients.map((i) => `- ${formatIngredient(i, t)}`).join("\n")}
------------------------------------------
${t("recipe.instructions").toUpperCase()}:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n\n")}
`.trim();

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(`Failed to export as TXT: ${error.message}`);
  }
};
