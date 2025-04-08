import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recipe } from "@/types/recipe";
import NoResults from "@/components/NoResults";
import { Link } from "react-router-dom";

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
  if (!recipes || recipes.length === 0) {
    return searchQuery ? (
      <NoResults searchQuery={searchQuery} onClear={onClearSearch} />
    ) : (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No recipes yet</h3>
        <p className="text-muted-foreground">
          Add your first recipe to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <Card
          key={recipe.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <Link to={`/recipes/${recipe.slug}`} title={recipe.title}>
            <div
              className="h-48 bg-cover bg-center cursor-pointer"
              style={{ backgroundImage: `url(${recipe.image})` }}
            />
          </Link>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Link
                to={`/recipes/${recipe.slug}`}
                className="block"
                title={recipe.title}
              >
                <h3 className="font-semibold text-xl cursor-pointer hover:text-orange-600 transition-colors">
                  {recipe.title}
                </h3>
              </Link>
              <div className="flex flex-wrap gap-2">
                {recipe.tags &&
                  recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-orange-50 dark:bg-orange-900"
                    >
                      {tag}
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
                  <span>Serves {recipe.servings}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditRecipe(recipe)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteRecipe(recipe.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
