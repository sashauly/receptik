import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Edit, Share2, Trash2, Users } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { useIsMobile } from "@/hooks/useMobile";

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export default function RecipeDetail({
  recipe,
  onEdit,
  onDelete,
  onShare,
}: RecipeDetailProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <div
              className="w-full h-64 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${recipe.image})` }}
            />
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-orange-50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Prep:</strong> {recipe.prepTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Cook:</strong> {recipe.cookTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Servings:</strong> {recipe.servings}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-row justify-between p-6 pt-0">
              <Button
                className="flex gap-2"
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                {!isMobile && "Edit"}
              </Button>
              <Button
                className="flex gap-2"
                variant="outline"
                size="sm"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
                {!isMobile && "Share"}
              </Button>
              <Button
                className="flex gap-2"
                variant="outline"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                {!isMobile && "Delete"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Recipe Details</h2>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Instructions</h3>
                <ol className="list-decimal pl-5 space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="pl-2">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
