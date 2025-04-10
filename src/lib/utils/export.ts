/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Recipe } from "@/types/recipe";
import html2canvas from "html2canvas-pro";
import DOMPurify from "dompurify";

export const exportAsJson = async (recipe: Recipe) => {
  try {
    // Create a JSON blob
    const data = JSON.stringify(recipe, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger it
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

export const exportAllRecipesAsJson = (recipes: Recipe[]) => {
  try {
    if (!recipes || recipes.length === 0) {
      throw new Error("No saved recipes found.");
    }

    //Sanitize each recipe (example sanitization, more robust solution is preferable)
    const sanitizedRecipes = recipes.map((recipe: any) => ({
      title: recipe.title.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      ingredients: recipe.ingredients.map((i: string) =>
        i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      ),
      instructions: recipe.instructions.map((i: string) =>
        i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      ),
    }));

    const data = JSON.stringify(sanitizedRecipes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger it
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
    // Format recipe as text
    const text = `
${recipe.title}

Prep Time: ${recipe.prepTime}
Cook Time: ${recipe.cookTime}
Servings: ${recipe.servings}
Tags: ${recipe.tags.join(", ")}

INGREDIENTS:
${recipe.ingredients.map((i) => `- ${i}`).join("\n")}

INSTRUCTIONS:
${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}
`.trim();

    // Create a text blob
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger it
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
  // Create a temporary div to render the recipe
  const tempDiv = document.createElement("div");
  tempDiv.style.width = "800px";
  tempDiv.style.padding = "20px";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h1 style="color: #ea580c; margin-bottom: 10px;">${recipe.title}</h1>
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
          <strong>Tags:</strong> ${recipe.tags.join(", ")}
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
    // Use html2canvas to convert the div to an image
    const canvas = await html2canvas(tempDiv);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;

      // Create download link
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
    // Clean up
    document.body.removeChild(tempDiv);
  }
};
