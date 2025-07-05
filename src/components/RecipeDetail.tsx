import RecipeImages from "@/components/recipe-detail/RecipeImages";
import RecipeIngredients from "@/components/recipe-detail/RecipeIngredients";
import RecipeInstructions from "@/components/recipe-detail/RecipeInstructions";
// import RecipeKeywords from "@/components/recipe-detail/RecipeKeywords";
import RecipeTimes from "@/components/recipe-detail/RecipeTimes";
import RecipeDescription from "@/components/recipe-detail/RecipeDescription";
import type { Recipe } from "@/types/recipe";
import { Separator } from "./ui/separator";
import { useSettings } from "@/context/SettingsContext";
import {
  Clock,
  CookingPot,
  Edit,
  ImageIcon,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { ContentLayout } from "./layout/ContentLayout";

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
    <ContentLayout title={recipe.name} className="relative pt-0">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Left column*/}
        <div className="relative w-full lg:w-1/2 flex flex-col gap-4">
          {/* Image */}
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-b-3xl sm:aspect-[4/3] md:max-h-[420px] md:mx-0 md:rounded-2xl">
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
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap mb-2">
            <Button asChild variant="default">
              <Link
                to={`/cook/${recipe.slug}`}
                className="flex items-center gap-2"
              >
                <CookingPot />
                {t("recipe.startCooking")}
              </Link>
            </Button>
            {/* <Button variant="outline" disabled onClick={onAddToFavorites}>
              <Heart />
              {!isMobile && t("common.addToFavorites")}
            </Button> */}
            <Button
              onClick={onEdit}
              aria-label="Edit"
              variant="outline"
              size="default"
            >
              <Edit size={20} />
              <span>{t("common.edit")}</span>
            </Button>
            <Button
              onClick={onShare}
              aria-label="Share"
              variant="outline"
              size="default"
            >
              <Share2 size={20} />
              <span>{t("common.share")}</span>
            </Button>
            <Button
              onClick={onDelete}
              aria-label="Delete"
              variant="destructive"
              size="default"
            >
              <Trash2 size={20} />
              <span>{t("common.delete")}</span>
            </Button>
          </div>

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

          {/* Times, Keywords */}
          <RecipeTimes
            cookTime={recipe.cookTime}
            prepTime={recipe.prepTime}
            totalTime={recipe.totalTime}
          />

          <Separator />
        </div>

        {/* Right column: Details */}
        <div className="flex-1 p-0 lg:p-4 lg:pl-0 space-y-4">
          <RecipeIngredients
            ingredients={recipe.ingredients}
            servings={recipe.servings}
          />

          <RecipeInstructions instructions={recipe.instructions} />
        </div>
      </div>
    </ContentLayout>
  );
}
