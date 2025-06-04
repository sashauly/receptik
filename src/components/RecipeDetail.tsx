import RecipeHeader from "@/components/recipe-detail/RecipeHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBaseUnitByValue } from "@/lib/measurements";
import type { Ingredient, Recipe } from "@/types/recipe";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import RecipeKeywords from "@/components/recipe-detail/RecipeKeywords";
import RecipeTimes from "@/components/recipe-detail/RecipeTimes";
import RecipeServings from "./recipe-detail/RecipeServings";

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export default function RecipeDetail({
  recipe,
  onEdit,
  onDelete,
  onShare,
}: RecipeDetailProps) {
  const { t } = useTranslation();

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
    <>
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <Card>
        <CardHeader>
          <CardTitle>{recipe.name}</CardTitle>
          {recipe.description && (
            <CardDescription>{recipe.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {recipe.keywords && recipe.keywords.length > 0 && (
            <>
              <Separator />
              <RecipeKeywords keywords={recipe.keywords} />
            </>
          )}

          <RecipeTimes
            cookTime={recipe.cookTime}
            prepTime={recipe.prepTime}
            totalTime={recipe.totalTime}
          />

          <RecipeServings servings={recipe.servings} />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("recipe.ingredients")}
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
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

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("recipe.instructions")}
            </h3>
            <ol className="space-y-3 pl-5 list-decimal">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          {/* TODO add author */}
          <>
            {/* <div itemProp="author">{recipe.author}</div> */}
            {recipe.updatedAt && (
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span itemProp="dateModified">
                  Last updated:{" "}
                  {recipe.updatedAt.toLocaleString(
                    localStorage.getItem("receptik-i18nextLng") || "en"
                  )}
                </span>
              </div>
            )}
          </>
        </CardFooter>
      </Card>
    </>
  );
}
