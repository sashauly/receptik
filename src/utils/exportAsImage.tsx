/* eslint-disable @typescript-eslint/no-explicit-any */
import { RecipeExportTemplate } from "@/components/RecipeExportTemplate";
import type { Recipe } from "@/types/recipe";
import html2canvas from "html2canvas-pro";
import type { TFunction } from "i18next";
import { createRoot } from "react-dom/client";

export const exportAsImage = async (
  recipe: Recipe,
  t: TFunction,
  orientation: "horizontal" | "vertical" = "horizontal",
) => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    <RecipeExportTemplate recipe={recipe} t={t} orientation={orientation} />,
  );

  await new Promise((resolve) => setTimeout(resolve, 150));

  try {
    const target = container.firstChild as HTMLElement;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement("a");
    link.download = `${recipe.slug}-${orientation}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error: any) {
    console.error("Export Error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
};
