import RecipeFooter from "@/components/recipe-detail/RecipeFooter";
import RecipeHeader from "@/components/recipe-detail/RecipeHeader";
import RecipeImages from "@/components/recipe-detail/RecipeImages";
import RecipeIngredients from "@/components/recipe-detail/RecipeIngredients";
import RecipeInstructions from "@/components/recipe-detail/RecipeInstructions";
import RecipeKeywords from "@/components/recipe-detail/RecipeKeywords";
import RecipeTimes from "@/components/recipe-detail/RecipeTimes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Recipe } from "@/types/recipe";

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
  return (
    <>
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <Card itemScope itemType="https://schema.org/Recipe">
        <CardHeader>
          <CardTitle itemProp="name">{recipe.name}</CardTitle>
          {recipe.description && (
            <CardDescription itemProp="description">
              {recipe.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {recipe.images && recipe.images.length > 0 && (
            <>
              <RecipeImages images={recipe.images} />
              <Separator />
            </>
          )}

          {recipe.keywords && recipe.keywords.length > 0 && (
            <>
              <RecipeKeywords keywords={recipe.keywords} />
              <Separator />
            </>
          )}

          <RecipeTimes
            cookTime={recipe.cookTime}
            prepTime={recipe.prepTime}
            totalTime={recipe.totalTime}
          />

          <RecipeIngredients
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />

          <Separator />

          <RecipeInstructions instructions={recipe.instructions} />
        </CardContent>

        <CardFooter className="flex justify-between">
          <RecipeFooter updatedAt={recipe.updatedAt} author={recipe.author} />
        </CardFooter>
      </Card>
    </>
  );
}
