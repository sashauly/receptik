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
import { Clock, CookingPot, User } from "lucide-react";
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

      <div className="relative w-full h-56 md:h-72 flex items-end justify-start overflow-hidden rounded-b-3xl">
        {recipe.images && recipe.images.length > 0 && (
          <div className="absolute inset-0 z-0">
            <RecipeImages images={recipe.images} />
          </div>
        )}
        <div className="z-10 px-4 py-2">
          <h1
            className="text-3xl md:text-4xl font-bold drop-shadow-lg text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}
            itemProp="name"
          >
            {recipe.name}
          </h1>
          <div className="mt-1 z-10 flex items-center gap-4 text-sm text-white">
            {recipe.author && (
              <div className="flex items-center gap-1">
                <User size={14} />
                <p>{recipe.author}</p>
              </div>
            )}
            {recipe.updatedAt && (
              <div className="flex items-center gap-1 ">
                <Clock size={14} />
                <span itemProp="dateModified">
                  {recipe.updatedAt.toLocaleString(settings.language)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 py-2">
            <Button asChild variant="default">
              <Link
                to={`/cook/${recipe.slug}`}
                className="flex items-center gap-2"
              >
                <CookingPot />
                {t("recipe.startCooking")}
              </Link>
            </Button>
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
