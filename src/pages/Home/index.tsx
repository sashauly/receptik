import {
  Book,
  Filter,
  HomeIcon,
  Menu,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";

import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import SearchInput from "@/components/SearchInput";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useRecipes } from "@/hooks/recipes/useRecipes";

// import RecipeDetail from "@/pages/RecipeDetail";
// import RecipeEdit from "@/pages/RecipeEdit";
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
      <div className="flex flex-col h-screen">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4 flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-orange-600" />
                  {t("common.appName")}
                </SheetTitle>
              </SheetHeader>
              <SheetDescription>
                TODO This is where the description would go.
              </SheetDescription>
              <nav className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {t("navigation.myRecipes")}
                </Link>
                <Separator className="my-2" />
                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  {t("navigation.settings")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold">{t("navigation.myRecipes")}</h1>
          <div className="flex items-center gap-2">
            <Button asChild size="icon" variant="outline">
              <Link to="/settings" title={t("settings.title")}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">{t("settings.title")}</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <SearchInput onSearch={handleSearch} />
          <RecipeList
            recipes={recipes}
            isLoading={recipesLoading}
            error={recipesError}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            searchTerm={currentSearchTerm}
            onClearSearch={handleClearSearch}
          />
        </main>

        <footer className="flex justify-around items-center h-16 border-t bg-background shadow-lg">
          <Button asChild variant="ghost">
            <NavLink to="/" className="flex flex-col items-center gap-1">
              <HomeIcon className="h-5 w-5" />
              <span className="text-xs">{t("navigation.myRecipes")}</span>
            </NavLink>
          </Button>
          <Button
            asChild
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full -mt-8 shadow-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 active:bg-primary/80"
          >
            <Link to="/recipes/create" title={t("common.addRecipe")}>
              <PlusCircle className="h-6 w-6" />
              <span className="sr-only">{t("common.addRecipe")}</span>
            </Link>
          </Button>
          <Button variant="ghost">
            <NavLink
              to="/settings"
              className="flex flex-col items-center gap-1"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">{t("navigation.settings")}</span>
            </NavLink>
          </Button>
        </footer>

        <DeleteRecipeDialog
          recipeToDelete={recipeToDelete}
          isLoading={deleteLoading || recipeToDeleteLoading}
          error={deleteError}
          isOpen={!!deleteRecipeId}
          onClose={handleCloseModals}
          onConfirm={confirmDeleteRecipe}
        />
      </div>
    );
  } else {
    // Desktop Layout
    return (
      <div className="flex h-screen">
        <aside className="w-64 p-6 border-r flex flex-col bg-card shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Book className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold">{t("common.appName")}</h2>
          </div>
          <nav className="flex flex-col gap-2 mb-4">
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

        {/* Desktop Main Content (Split Pane - List + Detail/Empty State) */}
        <main className="flex-1 flex overflow-hidden">
          {/* Left Pane: Recipe List */}
          <section className="w-2/3 max-w-[800px] p-6 overflow-y-auto border-r space-y-4">
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

            <RecipeList
              recipes={recipes}
              isLoading={recipesLoading}
              error={recipesError}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              searchTerm={currentSearchTerm}
              onClearSearch={handleClearSearch}
            />
          </section>

          {/* Right Pane: Recipe Detail or Empty State (dynamic content) */}
          {/* <section className="flex-1 p-6 overflow-y-auto flex items-center justify-center bg-muted/20">
            <div className="text-center text-muted-foreground">
              <h3 className="text-xl font-semibold mb-2">
                {t("desktop.selectRecipe")}
              </h3>
              <p>{t("desktop.viewDetailsPrompt")}</p>
            </div> 
          </section> */}
        </main>

        <DeleteRecipeDialog
          recipeToDelete={recipeToDelete}
          isLoading={deleteLoading || recipeToDeleteLoading}
          error={recipeToDeleteError || deleteError}
          isOpen={!!recipeToDelete}
          onClose={handleCloseModals}
          onConfirm={confirmDeleteRecipe}
        />
      </div>
    );
  }
}
