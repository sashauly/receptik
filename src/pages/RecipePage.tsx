import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeDetail from "@/components/RecipeDetail";
import ShareRecipeDialog from "@/components/ShareRecipeDialog";
import { Button } from "@/components/ui/button";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useUrlParams } from "@/hooks/useUrlParams";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useObjectUrl } from "@/hooks/useObjectUrl";

export default function RecipePage() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const recipeSlug = slug === "create" ? undefined : slug;
  const { getParam, updateParams } = useUrlParams();

  const navigate = useNavigate();

  const { recipe } = useRecipe({
    slug: recipeSlug,
  });

  const imageUrl = useObjectUrl(recipe?.images?.[0]?.data);

  const {
    deleteRecipe,
    isLoading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();

  const showDelete = getParam("delete") === "true";
  const showShare = getParam("share") === "true";

  const handleEditRecipe = () => {
    navigate(`/recipes/${recipeSlug}/edit`);
  };

  const handleDeleteRecipe = () => {
    updateParams({ delete: "true" });
  };

  const handleShareRecipe = () => {
    updateParams({ share: "true" });
  };

  const handleCloseModals = () => {
    updateParams({
      delete: null,
      share: null,
    });
  };

  const confirmDeleteRecipe = async () => {
    if (recipe) {
      await deleteRecipe(recipe.id);
      navigate("/");
      toast.success("Recipe Deleted");
    }
  };

  const handleClickBackButton = () => {
    navigate("/");
  };

  if (recipe === null) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Button
          variant="ghost"
          onClick={handleClickBackButton}
          className="flex items-center"
        >
          <ChevronLeft />
          {t("common.back")}
        </Button>
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">{t("recipe.recipeNotFound")}</h3>
          <p className="text-muted-foreground">
            {t("recipe.recipeNotFoundDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {recipe && (
        <ErrorBoundary componentName="RecipeDetail">
          <RecipeDetail
            recipe={recipe}
            imageUrl={imageUrl}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
            onShare={handleShareRecipe}
          />
        </ErrorBoundary>
      )}

      <ErrorBoundary componentName="DeleteRecipeDialog">
        <DeleteRecipeDialog
          recipeToDelete={recipe}
          isLoading={deleteLoading}
          error={deleteError}
          isOpen={showDelete}
          onClose={handleCloseModals}
          onConfirm={confirmDeleteRecipe}
        />
      </ErrorBoundary>

      {recipe && (
        <ErrorBoundary componentName="ShareRecipeDialog">
          <ShareRecipeDialog
            recipe={recipe}
            open={showShare}
            onOpenChange={handleCloseModals}
          />
        </ErrorBoundary>
      )}
    </>
  );
}
