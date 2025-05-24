import { formatDuration } from "@/lib/utils/time";
import { Recipe } from "@/types/recipe";
import { Clock, Edit, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipeId: string) => void;
  onDeleteRecipe: (id: string) => void;
}

const RecipeCard = ({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeCardProps) => {
  const { t } = useTranslation();

  const totalTimeString = formatDuration(recipe.totalTime, t);

  const onEditClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onEditRecipe(recipe.slug);
  };

  const onDeleteClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onDeleteRecipe(recipe.id);
  };

  return (
    <li>
      <Link to={`/recipes/${recipe.slug}`} viewTransition className="block" title={recipe.name}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
          <CardContent className="p-4 flex-grow">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl cursor-pointer">
                {recipe.name}
              </h3>
              <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <meta itemProp="totalTime" content={recipe.totalTime} />
                  <span>{totalTimeString}</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  <span>
                    {recipe.servings}{" "}
                    {t("recipe.servings_interval", {
                      postProcess: "interval",
                      count: Number(recipe.servings),
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={onEditClick}
              title={t("common.edit")}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onDeleteClick}
              title={t("common.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </li>
  );
};

export default RecipeCard;
