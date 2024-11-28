import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";
import { Recipe } from "@/types/recipe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        {recipe.image && (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {(recipe.prepTime || recipe.cookTime) && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {recipe.prepTime && `${recipe.prepTime} min prep`}
                  {recipe.prepTime && recipe.cookTime && " + "}
                  {recipe.cookTime && `${recipe.cookTime} min cook`}
                </span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
