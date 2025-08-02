/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Recipe } from "@/types/recipe";
import html2canvas from "html2canvas-pro";
import DOMPurify from "dompurify";

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

// Export all recipes, converting image Blobs to base64 strings
export const exportAllRecipesAsJson = async (recipes: Recipe[]) => {
  try {
    if (!recipes || recipes.length === 0) {
      throw new Error("No saved recipes found.");
    }

    // Convert all image Blobs to base64 strings for export
    const recipesWithBase64Images = await Promise.all(
      recipes.map(async (recipe) => {
        if (!recipe.images || recipe.images.length === 0) return recipe;
        const images = await Promise.all(
          recipe.images.map(async (img) => {
            const base64 = await blobToBase64(img.data);
            return {
              ...img,
              data: base64, // base64 string for export
            };
          })
        );
        return { ...recipe, images };
      })
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

export const exportAsTxt = async (recipe: Recipe) => {
  try {
    const text = `
${recipe.name}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}
Tags: ${recipe.keywords?.join(", ")}

INGREDIENTS:
${recipe.ingredients.map((i) => `- ${i}`).join("\n")}

INSTRUCTIONS:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}
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
    throw new Error(`Failed to export as TXT. ${error} Please try again.`);
  }
};

export const exportAsImage = async (recipe: Recipe) => {
  const tempDiv = document.createElement("div");
  tempDiv.style.width = "800px";
  tempDiv.style.padding = "20px";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="color: #ea580c; margin-bottom: 10px;">${recipe.name}</h1>
        <div style="display: flex; margin-bottom: 10px;">
          <div style="margin-right: 20px;"><strong>Prep:</strong> ${
            recipe.prepTime
          }</div>
          <div style="margin-right: 20px;"><strong>Cook:</strong> ${
            recipe.cookTime
          }</div>
          <div><strong>Servings:</strong> ${recipe.servings}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Tags:</strong> ${recipe.keywords?.join(", ")}
        </div>
        <div style="margin-bottom: 20px;">
          <h2 style="color: #ea580c; margin-bottom: 10px;">Ingredients</h2>
          <ul style="padding-left: 20px;">
            ${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 style="color: #ea580c; margin-bottom: 10px;">Instructions</h2>
          <ol style="padding-left: 20px;">
            ${recipe.instructions.map((step) => `<li>${step}</li>`).join("")}
          </ol>
        </div>
      </div>
    `;
  tempDiv.innerHTML = DOMPurify.sanitize(htmlContent);

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${recipe.slug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } catch (error: any) {
    throw new Error(`Failed to generate image. ${error} Please try again.`);
  } finally {
    document.body.removeChild(tempDiv);
  }
};
