import type { Recipe } from "@/types/recipe";
import { formatIngredient } from "@/utils/export";
import { formatDuration } from "@/utils/time";
import { TFunction } from "i18next";

interface Props {
  recipe: Recipe;
  t: TFunction;
  orientation: "horizontal" | "vertical";
}

export function RecipeExportTemplate({ recipe, t, orientation }: Props) {
  const isHorizontal = orientation === "horizontal";
  const shouldSplitIngredients = recipe.ingredients.length > 8;

  return (
    <div
      className={`bg-slate-100 flex items-center justify-center font-sans p-0
        ${isHorizontal ? "w-[1123px] h-[794px]" : "w-[794px] h-[1123px]"}`}
    >
      <div className="w-[92%] h-[92%] bg-white p-10 shadow-2xl rounded-sm flex flex-col">
        {/* Header */}
        <header className="border-b-2 border-orange-500 pb-5 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
            {recipe.name}
          </h1>
          <div className="flex gap-8 text-orange-600 font-bold text-sm uppercase tracking-wider">
            <span>
              {t("recipe.prepTime")}:{" "}
              {formatDuration(recipe.prepTime ?? "PT0S", t)}
            </span>
            <span>
              {t("recipe.cookTime")}: {formatDuration(recipe.cookTime, t)}
            </span>
            <span>
              {t("recipe.servings")}: {recipe.servings}
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`flex gap-10 flex-1 min-h-0 ${isHorizontal ? "flex-row" : "flex-col"}`}
        >
          {/* Ingredients */}
          <section className="flex-1">
            <h2 className="text-lg font-bold text-orange-600 mb-4 border-l-4 border-orange-500 pl-3 uppercase tracking-widest">
              {t("recipe.ingredients")}
            </h2>
            <div
              className={`grid gap-x-6 gap-y-1 ${shouldSplitIngredients && isHorizontal ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {recipe.ingredients.map((i, idx) => (
                <div
                  key={idx}
                  className="text-sm py-1.5 border-b border-slate-100 text-slate-700 flex items-baseline"
                >
                  <span className="text-orange-500 mr-2">•</span>
                  <span>{formatIngredient(i, t)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Instructions */}
          <section className="flex-[1.5]">
            <h2 className="text-lg font-bold text-orange-600 mb-4 border-l-4 border-orange-500 pl-3 uppercase tracking-widest">
              {t("recipe.instructions")}
            </h2>
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 text-sm leading-relaxed text-slate-800"
                >
                  <span className="font-black text-orange-500 text-base">
                    {i + 1}
                  </span>
                  <p className="whitespace-pre-wrap">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <p>
            {t("common.appName")} — {new Date().getFullYear()}
          </p>
          <p className="italic">
            {recipe.author && `${t("forms.author")}: ${recipe.author}`}
          </p>
        </footer>
      </div>
    </div>
  );
}
