import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBaseUnitByValue } from "@/lib/measurements";
import { formatDuration } from "@/lib/utils/time";
import type { Ingredient, Recipe } from "@/types/recipe";
import { Clock, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const INGREDIENTS_TO_SHOW = 3;
const INSTRUCTIONS_TO_SHOW = 3;

interface RecipePreviewCardProps {
  recipe: Recipe;
}

const RecipePreviewCard: React.FC<RecipePreviewCardProps> = ({ recipe }) => {
  const { t } = useTranslation();

  const totalTimeString = formatDuration(recipe.totalTime, t);

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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{recipe.name}</CardTitle>
        {recipe.description && (
          <CardDescription>{recipe.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {recipe.keywords && recipe.keywords.length > 0 && (
          <>
            <div className="flex flex-wrap gap-1">
              {recipe.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="bg-orange-50 dark:bg-orange-900"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
            <Separator />
          </>
        )}

        <div className="flex items-center space-x-4">
          {totalTimeString && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{totalTimeString}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {recipe.servings}{" "}
              {t("recipe.servings_interval", {
                postProcess: "interval",
                count: Number(recipe.servings),
              })}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-1">{t("recipe.ingredients")}</h4>
          <ul className="list-disc list-inside text-muted-foreground">
            {recipe.ingredients
              .slice(0, INGREDIENTS_TO_SHOW)
              .map((ingredient, index) => (
                // Using index as key is acceptable for previews where order doesn't change
                <li key={ingredient.id || index}>
                  <span>{ingredient.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {ingredient.amount !== 0 && ingredient.amount}{" "}
                    {getIngredientUnitLabel(ingredient)}
                  </span>
                </li>
              ))}
            {recipe.ingredients.length > INGREDIENTS_TO_SHOW && (
              <p className="italic text-xs">
                ...{" "}
                {t("importRecipes.moreIngredients", {
                  count: recipe.ingredients.length - INGREDIENTS_TO_SHOW,
                })}{" "}
                {t("recipe.ingredient_interval", {
                  postProcess: "interval",
                  count: recipe.ingredients.length - INGREDIENTS_TO_SHOW,
                })}
              </p>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-1">{t("recipe.instructions")}</h4>
          <ol className="list-decimal list-inside text-muted-foreground">
            {recipe.instructions
              .slice(0, INSTRUCTIONS_TO_SHOW)
              .map((step, index) => (
                <li key={index}>
                  {step.length > 70 ? `${step.substring(0, 70)}...` : step}
                </li>
              ))}
            {recipe.instructions.length > INSTRUCTIONS_TO_SHOW && (
              <p className="italic text-xs">
                ...{" "}
                {t("importRecipes.moreInstructions", {
                  count: recipe.instructions.length - INSTRUCTIONS_TO_SHOW,
                })}{" "}
                {t("recipe.step_interval", {
                  postProcess: "interval",
                  count: recipe.instructions.length - INSTRUCTIONS_TO_SHOW,
                })}
              </p>
            )}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipePreviewCard;
