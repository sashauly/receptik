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

export const exportAllRecipesAsJson = (recipes: Recipe[]) => {
  try {
    if (!recipes || recipes.length === 0) {
      throw new Error("No saved recipes found.");
    }

    // const sanitizedRecipes = recipes.map((recipe: any) => ({
    //   title: recipe.title.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    //   ingredients: recipe.ingredients.map((i: string) =>
    //     i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    //   ),
    //   instructions: recipe.instructions.map((i: string) =>
    //     i.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    //   ),
    // }));

    const data = JSON.stringify(recipes);
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
