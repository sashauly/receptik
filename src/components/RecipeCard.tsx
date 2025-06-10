import React from "react";
import { formatDuration } from "@/lib/utils/time";
import { Recipe } from "@/types/recipe";
import { Clock, Edit, MoreVertical, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router"; // Assuming react-router-dom
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipeSlug: string) => void;
  onDeleteRecipe: (id: string) => void;
  viewMode: "grid" | "list";
}

const RecipeCard = ({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
  viewMode,
}: RecipeCardProps) => {
  const { t } = useTranslation();

  const totalTimeString = formatDuration(recipe.totalTime, t);

  const handleEditClick = () => {
    onEditRecipe(recipe.slug);
  };

  const handleDeleteClick = () => {
    onDeleteRecipe(recipe.id);
  };

  return (
    <li className={viewMode === "list" ? "w-full" : "h-full"}>
      <Card
        className={`overflow-hidden hover:shadow-md transition-shadow h-full flex ${viewMode === "list" ? "flex-row items-center" : "flex-col"}`}
      >
        {/* <div
          className={
            viewMode === "list" ? "w-32 h-32 mr-4 flex-shrink-0" : "w-full h-48"
          }
        >
          <img />
        </div> */}

        <Link
          to={`/recipes/${recipe.slug}`}
          className="block flex-grow"
          title={recipe.name}
        >
          <CardContent
            className={`p-4 space-y-3 ${viewMode === "list" ? "flex-grow" : ""}`}
          >
            <h3 className="font-semibold text-md md:text-xl leading-tight truncate">
              {recipe.name}
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
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

            <div className="flex flex-col md:flex-row items-baseline gap-2 text-sm text-muted-foreground">
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
          </CardContent>
        </Link>

        <CardFooter
          className={`p-4 border-t ${viewMode === "list" ? "shrink-0 border-t-0 border-l" : "grow-0 justify-end"}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={buttonVariants({ variant: "outline", size: "icon" })}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">{t("common.moreActions")}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={handleEditClick}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>{t("common.edit")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>{t("common.delete")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </li>
  );
};

export default React.memo(RecipeCard);
