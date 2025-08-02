import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface RecipeInstructionsProps {
  instructions: string[];
}

export default function RecipeInstructions({
  instructions,
}: RecipeInstructionsProps) {
  const { t } = useTranslation();
  if (!instructions || instructions.length === 0) return null;
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">
        {t("recipe.instructions")}
      </h3>
      <ol
        className={cn(
          "list-decimal pl-6 space-y-1 text-sm",
          "marker:text-primary marker:font-medium",
        )}
      >
        {instructions.map((step, index) => (
          <li key={index} itemProp="recipeInstructions">
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
