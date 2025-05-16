import NoResults from "@/components/NoResults";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types/recipe";
import { BookPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  onClearSearch: () => void;
  onEditRecipe: (recipeId: string) => void;
  onDeleteRecipe: (id: string) => void;
}

export default function RecipeList({
  recipes,
  isLoading,
  error,
  searchQuery,
  onClearSearch,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("home.loadingRecipes")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("home.errorLoadingRecipes")}
      </div>
    );
  }

  const showNoRecipesState = !recipes || recipes.length === 0;

  if (showNoRecipesState) {
    return searchQuery ? (
      <NoResults searchQuery={searchQuery} onClear={onClearSearch} />
    ) : (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        <h3 className="text-lg font-medium mb-2">{t("home.noRecipes")}</h3>
        <p className="text-muted-foreground mb-4">{t("home.addYourFirst")}</p>
        <Button
          asChild
          className=" bg-orange-600 hover:bg-orange-700 dark:text-white"
        >
          <Link to="/recipes/create" title={t("home.createFirstRecipe")}>
            <BookPlus />
            {t("home.createFirstRecipe")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recipes &&
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEditRecipe={onEditRecipe}
            onDeleteRecipe={onDeleteRecipe}
          />
        ))}
    </div>
  );
}
