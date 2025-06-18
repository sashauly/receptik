import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils/time";
import type { Recipe, RecipeImage } from "@/types/recipe";
import { Clock, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipeSlug: string) => void;
  onDeleteRecipe: (id: string) => void;
  viewMode: "grid" | "list";
}

interface RecipeImageProps {
  image?: RecipeImage;
  name: string;
  viewMode: "grid" | "list";
}

const RecipeImage = memo(({ image, name, viewMode }: RecipeImageProps) => {
  if (image) {
    return (
      <div className="relative w-full h-full">
        <img
          src={image.data}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          sizes={
            viewMode === "list" ? "80px" : "(max-width: 768px) 100vw, 320px"
          }
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center h-full bg-muted"
      aria-hidden="true"
    >
      <ImageIcon className="h-6 w-6 text-muted-foreground" />
    </div>
  );
});

RecipeImage.displayName = "RecipeImage";

export const RecipeCard = memo(function RecipeCard({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
  viewMode,
}: RecipeCardProps) {
  const { t } = useTranslation();
  const totalTimeString = formatDuration(recipe.totalTime, t);

  const handleEditClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onEditRecipe(recipe.slug);
    },
    [onEditRecipe, recipe.slug]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDeleteRecipe(recipe.id);
    },
    [onDeleteRecipe, recipe.id]
  );

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <li
      className={cn("w-full", viewMode === "grid" ? "h-[320px]" : "h-[80px]")}
    >
      <Link
        to={`/recipes/${recipe.slug}`}
        className="block w-full h-full"
        title={recipe.name}
        aria-label={t("desktop.viewDetailsPrompt", {
          recipeTitle: recipe.name,
        })}
      >
        <Card
          className={cn(
            "relative hover:shadow-md transition-shadow w-full flex",
            viewMode === "list" ? "flex-row items-center" : "flex-col h-full",
            "overflow-hidden"
          )}
        >
          {/* Image Section */}
          <div
            className={cn(
              viewMode === "list"
                ? "w-[80px] h-[80px] flex-shrink-0"
                : "w-full h-[160px]",
              "relative overflow-hidden"
            )}
          >
            <RecipeImage
              image={recipe.images?.[0]}
              name={recipe.name}
              viewMode={viewMode}
            />
          </div>

          {/* Content Section */}
          <div
            className={cn(
              "flex flex-col",
              viewMode === "list"
                ? "flex-1 min-w-0 max-w-[70%] px-4 justify-center"
                : "flex-1 p-4 justify-between"
            )}
          >
            <div className="flex flex-col gap-2 min-w-0">
              <CardTitle
                className={cn(
                  "line-clamp-2",
                  viewMode === "list" ? "text-sm" : "text-base"
                )}
              >
                {recipe.name}
              </CardTitle>

              {viewMode === "grid" && (
                <div className="line-clamp-2 text-sm text-muted-foreground">
                  {recipe.description ? (
                    <p className="break-words">{recipe.description}</p>
                  ) : (
                    <p className="text-muted-foreground/50 italic">
                      {t("common.noDescription")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Time */}
            <div
              className={cn(
                "flex items-center gap-1 text-sm text-muted-foreground",
                viewMode === "list" ? "mt-1" : "mt-auto"
              )}
            >
              <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">
                {totalTimeString || t("common.loading")}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="absolute right-4 top-4">
              <button
                className={buttonVariants({
                  variant: "outline",
                  size: "icon",
                })}
                onClick={handleMoreClick}
                aria-label={t("common.moreActions")}
              >
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                {t("common.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteClick}
              >
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </Link>
    </li>
  );
});

RecipeCard.displayName = "RecipeCard";
