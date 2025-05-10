import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/types/recipe";
import NoResults from "@/components/NoResults";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RecipeListProps {
  recipes: Recipe[];
  searchQuery: string;
  onClearSearch: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
}

export default function RecipeList({
  recipes,
  searchQuery,
  onClearSearch,
  onEditRecipe,
  onDeleteRecipe,
}: RecipeListProps) {
  const { t } = useTranslation();

  if (!recipes || recipes.length === 0) {
    return searchQuery ? (
      <NoResults searchQuery={searchQuery} onClear={onClearSearch} />
    ) : (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">{t("home.noRecipes")}</h3>
        <p className="text-muted-foreground">{t("home.addYourFirst")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          to={`/recipes/${recipe.slug}`}
          className="block"
          title={recipe.name}
        >
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-xl cursor-pointer hover:text-orange-600 transition-colors">
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
                    <span>
                      {recipe.prepTime} + {recipe.cookTime}
                    </span>
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
                onClick={() => onEditRecipe(recipe)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDeleteRecipe(recipe.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
