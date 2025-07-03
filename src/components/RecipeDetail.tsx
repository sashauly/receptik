import RecipeHeader from "@/components/recipe-detail/RecipeHeader";
import RecipeImages from "@/components/recipe-detail/RecipeImages";
import RecipeIngredients from "@/components/recipe-detail/RecipeIngredients";
import RecipeInstructions from "@/components/recipe-detail/RecipeInstructions";
// import RecipeKeywords from "@/components/recipe-detail/RecipeKeywords";
import RecipeTimes from "@/components/recipe-detail/RecipeTimes";
import RecipeDescription from "@/components/recipe-detail/RecipeDescription";
import type { Recipe } from "@/types/recipe";
import { Separator } from "./ui/separator";
import { useSettings } from "@/context/SettingsContext";
import { Clock, CookingPot, ImageIcon, User } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export default function RecipeDetailRefined({
  recipe,
  onEdit,
  onDelete,
  onShare,
}: RecipeDetailProps) {
  const { settings } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      <RecipeHeader onEdit={onEdit} onDelete={onDelete} onShare={onShare} />

      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-3xl">
        {recipe.images && recipe.images.length > 0 ? (
          <RecipeImages images={recipe.images} />
        ) : (
          <div
            className="flex items-center justify-center h-full bg-muted"
            aria-hidden="true"
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        {/* Top gradient */}
        <div className="absolute left-0 top-0 w-full h-1/4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        {/* Bottom gradient */}
        <div className="absolute left-0 bottom-0 w-full h-1/4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-full z-10 p-4">
          <h1
            className="text-3xl font-bold text-white drop-shadow-lg"
            itemProp="name"
          >
            {recipe.name}
          </h1>
          {recipe.author && (
            <div className="flex items-center gap-2 text-white mt-1">
              <User size={14} />
              <span>{recipe.author}</span>
            </div>
          )}
          {recipe.updatedAt && (
            <div className="flex items-center gap-2 text-white mt-1">
              <Clock size={14} />
              <span itemProp="dateModified">
                {recipe.updatedAt.toLocaleString(settings.language)}
              </span>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button asChild variant="default">
              <Link
                to={`/cook/${recipe.slug}`}
                className="flex items-center gap-2"
              >
                <CookingPot />
                {t("recipe.startCooking")}
              </Link>
            </Button>{" "}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* {recipe.keywords && recipe.keywords.length > 0 && (
          <>
            <RecipeKeywords keywords={recipe.keywords} />
            <Separator />
          </>
        )} */}

        {/* Description */}
        {recipe.description && (
          <RecipeDescription description={recipe.description} />
        )}

        {/* Times, Keywords, Ingredients, Instructions */}
        <RecipeTimes
          cookTime={recipe.cookTime}
          prepTime={recipe.prepTime}
          totalTime={recipe.totalTime}
        />

        <Separator />

        <RecipeIngredients
          ingredients={recipe.ingredients}
          servings={recipe.servings}
        />

        <RecipeInstructions instructions={recipe.instructions} />
      </div>
    </div>
  );
}
