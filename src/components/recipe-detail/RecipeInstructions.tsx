import { useTranslation } from "react-i18next";

interface RecipeInstructionsProps {
  instructions: string[];
}

function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const { t } = useTranslation();
  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t("recipe.instructions")}</h3>
      <ol className="space-y-3 pl-5 list-decimal">
        {instructions.map((step, index) => (
          <li key={index} className="flex gap-4" itemProp="recipeInstructions">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <p className="flex-1">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default RecipeInstructions;
