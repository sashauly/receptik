import { getBaseUnitByValue } from "@/lib/measurements";
import { Ingredient } from "@/types/recipe";
import { useTranslation } from "react-i18next";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
}) => {
  const { t } = useTranslation();
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  const getIngredientUnitLabel = (ingredient: Ingredient): string => {
    const { unit, amount } = ingredient;
    if (getBaseUnitByValue(unit)?.type === "other") {
      if (unit === "toTaste" || unit === "optional") {
        return t(`units.other.${unit}`);
      }
      // @ts-expect-error Incompatible types with locale resources
      return t(`units.${getBaseUnitByValue(unit)?.type}.${unit}_interval`, {
        postProcess: "interval",
        count: Number(amount),
      });
    }

    // @ts-expect-error Incompatible types with locale resources
    return t(`units.${getBaseUnitByValue(unit)?.type}.${unit}_short`);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t("recipe.ingredients")}</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex justify-between items-center gap-2"
          >
            <span>{ingredient.name}</span>
            <span className="text-muted-foreground">
              {ingredient.amount !== 0 && ingredient.amount}{" "}
              {getIngredientUnitLabel(ingredient)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
