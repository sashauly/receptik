import ErrorBoundary from "@/components/ErrorBoundary";
import NoResults from "@/components/NoResults";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { useRecipeCardImages } from "@/hooks/useRecipeCardImages";
import { Recipe } from "@/types/recipe";
import { BookPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface RecipeListProps {
  recipes: Recipe[];
  onEditRecipe: (recipeId: string) => void;
  onDeleteRecipe: (id: string) => void;
  searchTerm: string;
  onClearSearch: () => void;
}

export default function RecipeList({
  recipes,
  onEditRecipe,
  onDeleteRecipe,
  searchTerm,
  onClearSearch,
}: RecipeListProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  // Call the hook unconditionally at the top level
  const imageUrls = useRecipeCardImages(recipes);

  const viewMode = settings.viewMode;

  if (recipes.length === 0) {
    if (searchTerm.trim() !== "") {
      return <NoResults searchQuery={searchTerm} onClear={onClearSearch} />;
    } else {
      return (
        <div className="w-full text-center py-12 border rounded-lg bg-muted/30">
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
  }

  return (
    <div className="space-y-4">
      <ul
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-4"
        }
      >
        {recipes.map((recipe) => (
          <ErrorBoundary componentName="RecipeCard" key={recipe.id}>
            <RecipeCard
              recipe={recipe}
              onEditRecipe={onEditRecipe}
              onDeleteRecipe={onDeleteRecipe}
              viewMode={viewMode}
              imageUrl={imageUrls.get(recipe.id)}
            />
          </ErrorBoundary>
        ))}
      </ul>
    </div>
  );
}
