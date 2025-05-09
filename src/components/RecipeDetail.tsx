import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Share2, Trash2, Users } from "lucide-react";
import type { Recipe } from "@/types/recipe";
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

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">{recipe.name}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div
              className="w-full h-64 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${recipe.image})` }}
            />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.keywords &&
                  recipe.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="bg-orange-50 dark:bg-orange-900"
                    >
                      {keyword}
                    </Badge>
                  ))}
              </div>

              <div className="space-y-2 text-sm">
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
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between p-6 pt-0">
              <Button
                className="flex gap-2 w-full"
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                {t("common.edit")}
              </Button>
              <Button
                className="flex gap-2 w-full"
                variant="outline"
                size="sm"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
                {t("common.share")}
              </Button>
              <Button
                className="flex gap-2 w-full"
                variant="outline"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                {t("common.delete")}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">{t("recipe.title")}</h2>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t("recipe.ingredients")}
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {recipe.ingredients &&
                    recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {t("recipe.instructions")}
                </h3>
                <ol className="list-decimal pl-5 space-y-4">
                  {recipe.instructions &&
                    recipe.instructions.map((step, index) => (
                      <li key={index} className="pl-2">
                        {step}
                      </li>
                    ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
