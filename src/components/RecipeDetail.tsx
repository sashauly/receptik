import RecipeHeader from "@/components/recipe-detail/RecipeHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDuration } from "@/lib/utils/time";
import type { Recipe } from "@/types/recipe";
import { Clock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

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

  const cookTimeString = formatDuration(recipe.prepTime || "PT0S", t);
  const prepTimeString = formatDuration(recipe.cookTime, t);
  const totalTimeString = formatDuration(recipe.totalTime, t);

  return (
    <>
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold tracking-tight">{recipe.name}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            {recipe.description && (
              <p className="text-muted-foreground">{recipe.description}</p>
            )}
          </div>

          {recipe.keywords && recipe.keywords.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
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
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            {recipe.prepTime && (
              <div className="bg-muted rounded-lg p-2">
                <h4 className="font-medium">{t("recipe.prepTime")}</h4>
                <p className="text-muted-foreground">
                  <meta itemProp="prepTime" content={recipe.prepTime} />
                  {prepTimeString}
                </p>
              </div>
            )}
            {recipe.cookTime && (
              <div className="bg-muted rounded-lg p-2">
                <h4 className="font-medium">{t("recipe.cookTime")}</h4>
                <p className="text-muted-foreground">
                  <meta itemProp="cookTime" content={recipe.cookTime} />
                  {cookTimeString}
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col bg-muted rounded-lg p-2">
            <h4 className="font-medium">{t("recipe.totalTime")}</h4>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                <meta itemProp="totalTime" content={recipe.totalTime} />
                {totalTimeString}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {recipe.servings}{" "}
              {t("recipe.servings_interval", {
                postProcess: "interval",
                count: Number(recipe.servings),
              })}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {t("recipe.ingredients")}
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
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
                <li key={index} className="pl-1">
                  {step}
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
