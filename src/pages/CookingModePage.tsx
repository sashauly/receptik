import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function CookingModePage() {
  const { slug } = useParams();
  const isSmallDevice = useMediaQuery("(max-width: 768px)");

  const { recipe, loading, error } = useRecipe({ slug });
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-8 text-center">{t("common.loading")}</div>;
  }

  if (error || !recipe)
    return (
      <div className="p-8 text-center text-destructive">
        {t("recipe.recipeNotFound")}
      </div>
    );

  const handleClickBackButton = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen container mx-auto w-full bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur p-4 border-b border-border flex items-center gap-2">
        <Button
          size={isSmallDevice ? "icon" : "sm"}
          variant="outline"
          onClick={handleClickBackButton}
          aria-label={t("common.back")}
        >
          <ChevronLeft />
          {!isSmallDevice && t("common.back")}
        </Button>
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
      </header>

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
    </div>
  );
}
