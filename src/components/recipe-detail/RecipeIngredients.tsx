import { getBaseUnitByValue } from "@/lib/measurements";
import { Ingredient } from "@/types/recipe";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import RecipeServings from "../recipe-detail/RecipeServings";
import { Badge } from "../ui/badge";
// import { Plus } from "lucide-react";
// import { Button } from "../ui/button";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  servings: number;
}

export default function RecipeIngredients({
  ingredients,
  servings: originalRecipeServings,
}: RecipeIngredientsProps) {
  const { t } = useTranslation();
  const [servings, setServings] = useState(originalRecipeServings);

  const handleServingsChange = useCallback((change: number) => {
    setServings((prevServings) => {
      const newServings = Math.max(1, prevServings + change);
      return newServings;
    });
  }, []);

  const servingsRatio = servings / originalRecipeServings;

  const ingredientsAmountOnServingsRatio = useCallback(
    (amount: number | null) => {
      if (amount === null) {
        return null;
      }
      return amount * servingsRatio;
    },
    [servingsRatio]
  );

  const ingredientAmountToString = useCallback((amount: number | null) => {
    if (amount === null) {
      return "";
    }
    if (typeof amount !== "number" || isNaN(amount)) {
      return "";
    }
    return amount.toFixed(2).replace(/\.00$/, "");
  }, []);

  const getIngredientUnitLabel = useCallback(
    (unit: string, amount: number | null): string => {
      const displayAmount = amount !== null ? amount : 0;
      if (getBaseUnitByValue(unit)?.type === "other") {
        if (unit === "toTaste" || unit === "optional") {
          return t(`units.other.${unit}`);
        }
        // @ts-expect-error Incompatible types with locale resources
        return t(`units.${getBaseUnitByValue(unit)?.type}.${unit}_interval`, {
          postProcess: "interval",
          count: Number(displayAmount),
        });
      }
      // @ts-expect-error Incompatible types with locale resources
      return t(`units.${getBaseUnitByValue(unit)?.type}.${unit}_short`);
    },
    [t]
  );

  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between mb-2">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold">{t("recipe.ingredients")}</h3>
          <p
            className="text-xs text-muted-foreground flex items-center gap-2"
            itemProp="recipeYield"
          >
            {servings}{" "}
            {t("recipe.servings_interval", {
              postProcess: "interval",
              count: Number(servings),
            })}
            <Badge variant="outline" className="ml-2">
              {t("common.default")}: {originalRecipeServings}
            </Badge>
          </p>
        </div>
        <RecipeServings
          servings={servings}
          onServingsChange={handleServingsChange}
        />
      </div>
      <ul className="divide-y divide-border">
        {ingredients.map((ingredient) => {
          const adjustedAmount = ingredientsAmountOnServingsRatio(
            ingredient.amount
          );
          return (
            <li
              key={ingredient.id || ingredient.name}
              className="flex items-center gap-3 py-2"
              itemProp="recipeIngredient"
            >
              {/* Placeholder for ingredient image */}
              {/* <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-10 h-10 rounded object-cover"
              /> */}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{ingredient.name}</p>
                <p className="text-muted-foreground text-sm">
                  {adjustedAmount !== null &&
                    adjustedAmount !== 0 &&
                    ingredientAmountToString(adjustedAmount)}{" "}
                  {getIngredientUnitLabel(ingredient.unit, adjustedAmount)}
                </p>
              </div>
              {/* <Button
                size="icon"
                className="rounded-full"
                aria-label="Add to cart"
              >
                <Plus className="w-5 h-5" />
              </Button> */}
            </li>
          );
        })}
      </ul>
    </>
  );
}
