import { Book, Filter, PlusCircle, Settings } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import ErrorBoundary from "@/components/ErrorBoundary";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";

import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import SearchInput from "@/components/SearchInput";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useRecipes } from "@/hooks/recipes/useRecipes";

import { logError } from "@/lib/utils/logger";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getParam, updateParams } = useUrlParams();

  const [currentSearchTerm, setCurrentSearchTerm] = useState("");

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes({ searchTerm: currentSearchTerm });

  const {
    deleteRecipe,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();
  const deleteRecipeId = getParam("delete");
  const {
    recipe: recipeToDelete,
    loading: recipeToDeleteLoading,
    error: recipeToDeleteError,
  } = useRecipe({ id: deleteRecipeId || undefined });

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleCloseModals = useCallback(() => {
    updateParams({ delete: null, share: null });
  }, [updateParams]);

  const handleEditRecipe = useCallback(
    (recipeSlug: string) => {
      navigate(`/recipes/${recipeSlug}/edit`);
    },
    [navigate]
  );

  const handleDeleteRecipe = useCallback(
    (recipeId: string) => {
      updateParams({ delete: recipeId });
    },
    [updateParams]
  );

  const confirmDeleteRecipe = async () => {
    if (deleteRecipeId) {
      handleCloseModals();
      try {
        await deleteRecipe(deleteRecipeId);
      } catch (error) {
        logError("Failed to confirm delete:", error);
      }
    }
  };

  const handleSearch = useCallback((searchTerm: string) => {
    setCurrentSearchTerm(searchTerm);
  }, []);

  const handleClearSearch = useCallback(() => {
    setCurrentSearchTerm("");
  }, []);

  if (isMobile) {
    return (
      <>
        {/* Mobile Main Content */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <SearchInput onSearch={handleSearch} />
          <ErrorBoundary componentName="RecipeList">
            <RecipeList
              recipes={recipes}
              isLoading={recipesLoading}
              error={recipesError}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              searchTerm={currentSearchTerm}
              onClearSearch={handleClearSearch}
            />
          </ErrorBoundary>
        </main>

        <ErrorBoundary componentName="DeleteRecipeDialog">
          <DeleteRecipeDialog
            recipeToDelete={recipeToDelete}
            isLoading={deleteLoading || recipeToDeleteLoading}
            error={deleteError}
            isOpen={!!deleteRecipeId}
            onClose={handleCloseModals}
            onConfirm={confirmDeleteRecipe}
          />
        </ErrorBoundary>
      </>
    );
  } else {
    // Desktop Layout
    return (
      <>
        <aside className="w-64 p-6 border-r flex flex-col bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Book className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold">{t("common.appName")}</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-lg font-medium text-primary hover:text-foreground"
            >
              {t("navigation.myRecipes")}
            </Link>
          </nav>

          <Separator className="my-4" />

          <div className="space-y-4 flex-grow">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
              <Filter className="h-5 w-5" />
              {t("common.filters")}
            </h3>
            <SearchInput onSearch={handleSearch} delay={300} />

            {/* Mock Filter Sections - Expandable */}
            {/* <div className="space-y-2">
              <h4 className="text-md font-medium text-muted-foreground">
                Categories
              </h4>
              <div className="flex flex-col gap-1 text-sm">
                <Button variant="ghost" className="justify-start h-8">
                  Dinner
                </Button>
                <Button variant="ghost" className="justify-start h-8">
                  Breakfast
                </Button>
                <Button variant="ghost" className="justify-start h-8">
                  Dessert
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-md font-medium text-muted-foreground">
                Cuisines
              </h4>
              <div className="flex flex-col gap-1 text-sm">
                <Button variant="ghost" className="justify-start h-8">
                  Italian
                </Button>
                <Button variant="ghost" className="justify-start h-8">
                  Asian
                </Button>
                <Button variant="ghost" className="justify-start h-8">
                  Indian
                </Button>
              </div>
            </div> */}
          </div>

          <Link
            to="/settings"
            className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground mt-auto pt-4"
          >
            <Settings className="h-5 w-5" />
            {t("navigation.settings")}
          </Link>
        </aside>

        {/* Desktop Main Content */}
        <main className="flex-1 overflow-hidden">
          <section className="h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {t("navigation.myRecipes")}
              </h1>
              <Button asChild>
                <Link to="/recipes/create" title={t("common.addRecipe")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("common.addRecipe")}
                </Link>
              </Button>
            </div>

            {recipesError && recipes.length === 0 && (
              <p className="text-destructive">
                {(recipesError as Error).message}
              </p>
            )}

            <ErrorBoundary componentName="RecipeList">
              <RecipeList
                recipes={recipes}
                isLoading={recipesLoading}
                error={recipesError}
                onEditRecipe={handleEditRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                searchTerm={currentSearchTerm}
                onClearSearch={handleClearSearch}
              />
            </ErrorBoundary>
          </section>
        </main>

        <ErrorBoundary componentName="DeleteRecipeDialog">
          <DeleteRecipeDialog
            recipeToDelete={recipeToDelete}
            isLoading={deleteLoading || recipeToDeleteLoading}
            error={recipeToDeleteError || deleteError}
            isOpen={!!recipeToDelete}
            onClose={handleCloseModals}
            onConfirm={confirmDeleteRecipe}
          />
        </ErrorBoundary>
      </>
    );
  }
}
