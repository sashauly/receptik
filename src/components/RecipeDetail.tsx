import RecipeHeader from "@/components/recipe-detail/RecipeHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatTime } from "@/lib/utils/time";
import type { Recipe } from "@/types/recipe";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import TimerDrawer from "./recipe-timer/TimerDrawer";

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

  const { timeString: prepTimeString, isoString: prepTimeIsoString } =
    formatTime(recipe.prepTime || 0, t);
  const { timeString: cookTimeString, isoString: cookTimeIsoString } =
    formatTime(recipe.cookTime || 0, t);
  const { timeString: totalTimeString, isoString: totalTimeIsoString } =
    formatTime(recipe.totalTime || 0, t);

  return (
    <>
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold tracking-tight">{recipe.name}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {recipe.prepTime !== 0 && (
              <div className="bg-muted rounded-lg p-2">
                <h4 className="font-medium">{t("recipe.prepTime")}</h4>
                <p className="text-muted-foreground">
                  <meta itemProp="prepTime" content={prepTimeIsoString} />
                  {prepTimeString}
                </p>
              </div>
            )}
            {recipe.cookTime !== 0 && (
              <div className="bg-muted rounded-lg p-2">
                <h4 className="font-medium">{t("recipe.cookTime")}</h4>
                <p className="text-muted-foreground">
                  <meta itemProp="cookTime" content={cookTimeIsoString} />
                  {cookTimeString}
                </p>
              </div>
            )}
            <div className="bg-muted rounded-lg p-2">
              <h4 className="font-medium">{t("recipe.totalTime")}</h4>
              <p className="text-muted-foreground">
                <meta itemProp="totalTime" content={totalTimeIsoString} />
                {totalTimeString}
              </p>
            </div>
          </div>

          <TimerDrawer>
            <Button>Open Timer</Button>
          </TimerDrawer>

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
          {/* TODO add author and dateCreated */}
        </CardFooter>
      </Card>
    </>
  );
}
