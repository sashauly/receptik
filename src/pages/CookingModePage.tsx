import { ContentLayout } from "@/components/layout/ContentLayout";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

export default function CookingModePage() {
  const { slug } = useParams();

  const { recipe, loading, error } = useRecipe({ slug });
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  if (loading) {
    return <div className="p-8 text-center">{t("common.loading")}</div>;
  }

  if (error || !recipe)
    return (
      <div className="p-8 text-center text-destructive">
        {t("recipe.recipeNotFound")}
      </div>
    );

  return (
    <ContentLayout title={recipe.name}>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="max-w-xl mx-auto space-y-4 px-2">
          {recipe.instructions.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex gap-4 text-lg cursor-pointer transition-all rounded-2xl p-6 border-2 bg-card ${
                idx === activeStep
                  ? "border-primary bg-primary/10 scale-105 shadow-lg"
                  : "border-border opacity-70"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-background font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>
              <div className="text-lg whitespace-pre-line">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}
