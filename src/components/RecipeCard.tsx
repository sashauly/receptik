import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/time";
import type { Recipe } from "@/types/recipe";
import { Clock, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "./ui/spinner";

interface RecipeCardProps {
  recipe: Recipe;
  onEditRecipe: (recipeSlug: string) => void;
  onDeleteRecipe: (id: string) => void;
  viewMode: "grid" | "list";
  imageUrl?: string;
}

const renderPlaceholder = () => (
  <div
    className="flex items-center justify-center h-full bg-muted"
    aria-hidden="true"
  >
    <ImageIcon className="h-6 w-6 text-muted-foreground" />
  </div>
);

export const RecipeCard = memo(function RecipeCard({
  recipe,
  onEditRecipe,
  onDeleteRecipe,
  viewMode,
  imageUrl,
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

  const actionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
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
  );

  const imageSection = (
    <div
      className={cn(
        "relative overflow-hidden",
        viewMode === "grid"
          ? "w-full h-[160px]"
          : "w-[80px] h-[80px] flex-shrink-0"
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover"
          loading="lazy"
          sizes={
            viewMode === "list" ? "80px" : "(max-width: 768px) 100vw, 320px"
          }
        />
      ) : (
        renderPlaceholder()
      )}
      {viewMode === "grid" && (
        <Badge className="absolute bottom-1 right-1 z-10" variant="default">
          <Clock
            className="h-3.5 w-3.5 inline-block align-text-bottom"
            aria-hidden="true"
          />
          {totalTimeString || <Spinner>{t("common.loading")}</Spinner>}
        </Badge>
      )}
    </div>
  );

  if (viewMode === "grid") {
    return (
      <li className="w-full">
        <Link
          to={`/recipes/${recipe.slug}`}
          className="block w-full h-full"
          title={recipe.name}
          aria-label={t("desktop.viewDetailsPrompt", {
            recipeTitle: recipe.name,
          })}
        >
          <Card className="relative w-full flex flex-col h-full overflow-hidden">
            {imageSection}
            <div className="flex flex-col p-4 justify-between">
              <div className="flex flex-col gap-2 min-w-0">
                <CardTitle className="line-clamp-2 text-base">
                  {recipe.name}
                </CardTitle>
                <div className="line-clamp-2 text-sm text-muted-foreground">
                  {recipe.description ? (
                    <p className="break-words">{recipe.description}</p>
                  ) : (
                    <p className="text-muted-foreground/50 italic">
                      {t("common.noDescription")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute right-2 top-2">{actionMenu}</div>
          </Card>
        </Link>
      </li>
    );
  }

  // List view
  return (
    <li className={cn("w-full", "h-[80px]")}>
      <Link
        to={`/recipes/${recipe.slug}`}
        className="block w-full h-full"
        title={recipe.name}
        aria-label={t("desktop.viewDetailsPrompt", {
          recipeTitle: recipe.name,
        })}
      >
        <Card className="relative w-full flex flex-row items-center overflow-hidden h-full">
          {imageSection}
          <div className="flex flex-col flex-1 min-w-0 max-w-[70%] px-4 justify-center">
            <div className="flex flex-col gap-2 min-w-0">
              <CardTitle className="line-clamp-2 text-sm">
                {recipe.name}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">
                {totalTimeString || <Spinner>{t("common.loading")}</Spinner>}
              </span>
            </div>
          </div>
          <div className="p-3">{actionMenu}</div>
        </Card>
      </Link>
    </li>
  );
});

RecipeCard.displayName = "RecipeCard";
