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
import { Clock, Users, AlertTriangle } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const INGREDIENTS_TO_SHOW = 3;
const INSTRUCTIONS_TO_SHOW = 3;

interface RecipePreviewCardProps {
  recipe: Recipe;
  invalidFields?: string[];
  invalidFieldErrors?: Record<string, string>;
}

const RecipePreviewCard: React.FC<RecipePreviewCardProps> = ({
  recipe,
  invalidFields = [],
  invalidFieldErrors = {},
}) => {
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

  const highlight = (field: string) =>
    invalidFields.includes(field)
      ? "border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 relative"
      : "";
  const warningIcon = (field: string) =>
    invalidFields.includes(field) ? (
      <span className="ml-2 flex gap-2 items-center">
        <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
        <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
          {invalidFieldErrors[field]}
        </span>
      </span>
    ) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className={highlight("name") + " text-xl flex items-center"}>
          {recipe.name}
          {warningIcon("name")}
        </CardTitle>
        {recipe.description && (
          <CardDescription
            className={highlight("description") + " flex items-center"}
          >
            {recipe.description}
            {warningIcon("description")}
          </CardDescription>
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
          <h4
            className={
              "font-semibold mb-1 flex items-center " + highlight("ingredients")
            }
          >
            {t("recipe.ingredients")}
            {warningIcon("ingredients")}
          </h4>
          <ul className="list-disc list-inside text-muted-foreground">
            {recipe.ingredients
              .slice(0, INGREDIENTS_TO_SHOW)
              .map((ingredient, index) => (
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
          <h4
            className={
              "font-semibold mb-1 flex items-center " +
              highlight("instructions")
            }
          >
            {t("recipe.instructions")}
            {warningIcon("instructions")}
          </h4>
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
