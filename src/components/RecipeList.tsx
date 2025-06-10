import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types/recipe";
import { BookPlus, LayoutGrid, List } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import React, { useState, useCallback } from "react";

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
  onEditRecipe: (recipeId: string) => void;
  onDeleteRecipe: (id: string) => void;
}

type ViewMode = "grid" | "list";

export default function RecipeList({
  recipes,
  isLoading,
  error,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeListProps) {
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const setGridView = useCallback(() => setViewMode("grid"), []);
  const setListView = useCallback(() => setViewMode("list"), []);

  const MemoizedRecipeCard = React.memo(RecipeCard);

  if (error && recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        {t("home.errorLoadingRecipes")}
      </div>
    );
  }

  if (isLoading && recipes.length === 0) {
    const skeletonCount = viewMode === "grid" ? 6 : 3;

    return (
      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {[...Array(skeletonCount)].map((_, index) => (
          <RecipeCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  const showNoRecipesState = !recipes || recipes.length === 0;

  if (showNoRecipesState) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-2">{t("home.noRecipes")}</h3>
        <p className="text-muted-foreground mb-4">{t("home.addYourFirst")}</p>
        <Button asChild>
          <Link to="/recipes/create" title={t("home.createFirstRecipe")}>
            <BookPlus className="mr-2 h-4 w-4" />
            {t("home.createFirstRecipe")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={setGridView}
          title={t("common.gridView")}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only">{t("common.gridView")}</span>
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={setListView}
          title={t("common.listView")}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">{t("common.listView")}</span>
        </Button>
      </div>

      {/* Conditional Rendering based on viewMode */}
      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {recipes.map((recipe) => (
          <MemoizedRecipeCard
            key={recipe.id}
            recipe={recipe}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
            viewMode={viewMode}
          />
        ))}
      </ul>
    </div>
  );
}
