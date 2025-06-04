import { getBaseUnitByValue } from "@/lib/measurements";
import { Ingredient } from "@/types/recipe";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import RecipeServings from "./RecipeServings";
import { logError } from "@/lib/utils/logger";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  servings: number;
  recipeId: string;
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
  servings: originalRecipeServings,
  recipeId,
}) => {
  const { t } = useTranslation();

  const localStorageKey = `receptik_servings_${recipeId}`;

  const [servings, setServings] = useState(() => {
    try {
      const storedServings = localStorage.getItem(localStorageKey);
      if (storedServings) {
        const parsedServings = parseInt(storedServings, 10);
        if (!isNaN(parsedServings) && parsedServings >= 1) {
          return parsedServings;
        }
      }
    } catch (error) {
      logError("Failed to read servings from localStorage:", error);
    }
    return originalRecipeServings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, servings.toString());
    } catch (error) {
      logError("Failed to write servings to localStorage:", error);
    }
  }, [servings, localStorageKey]);

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
    <div>
      <div className="flex justify-between mb-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{t("recipe.ingredients")}</h3>
          <p className="text-muted-foreground" itemProp="recipeYield">
            {servings}{" "}
            {t("recipe.servings_interval", {
              postProcess: "interval",
              count: Number(servings),
            })}
          </p>
        </div>
        <RecipeServings
          servings={servings}
          onServingsChange={handleServingsChange}
        />
      </div>
      <ul className="space-y-2">
        {ingredients.map((ingredient) => {
          const adjustedAmount = ingredientsAmountOnServingsRatio(
            ingredient.amount
          );
          return (
            <li
              key={ingredient.id}
              className="flex justify-between items-center gap-2"
              itemProp="recipeIngredient"
            >
              <span>{ingredient.name}</span>
              <span className="text-muted-foreground">
                {adjustedAmount !== null &&
                  adjustedAmount !== 0 &&
                  ingredientAmountToString(adjustedAmount)}{" "}
                {getIngredientUnitLabel(ingredient.unit, adjustedAmount)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
