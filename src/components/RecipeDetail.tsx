import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import RecipeHeader from "@/components/recipe-detail/RecipeHeader";

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

  return (
    <>
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <Card>
        <CardHeader>
          <h2 className="text-3xl font-bold tracking-tight">{recipe.name}</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {recipe.keywords && recipe.keywords.length > 0 && (
              <>
                <Separator />
                {recipe.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="bg-orange-50 dark:bg-orange-900"
                  >
                    {keyword}
                  </Badge>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>{t("recipe.prepTime")}</strong> {recipe.prepTime}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>{t("recipe.cookTime")}</strong> {recipe.cookTime}
                </span>
              </div>
            </>

            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                <strong>
                  {recipe.servings}{" "}
                  {t("recipe.servings_interval", {
                    postProcess: "interval",
                    count: Number(recipe.servings),
                  })}
                </strong>
              </span>
            </div>
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
