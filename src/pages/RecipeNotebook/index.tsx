import type React from "react";

import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRecipes } from "@/hooks/useRecipes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PlusCircle, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import BottomSearch from "./BottomSearch";
import DesktopRecipeNotebook from "./DesktopRecipeNotebook";

export default function RecipeNotebook() {
  const { t } = useTranslation();
  const {
    isLoading,
    deleteRecipe,
    getRecipeById,
    getAllKeywords,
    filterRecipes,
  } = useRecipes();

  const { getParam, updateParams } = useUrlParams();
  const navigate = useNavigate();

  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  const querySearch = getParam("q") || "";
  const queryTag = getParam("tag") || "all";
  const deleteRecipeId = getParam("delete");

  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [activeTag, setActiveTag] = useState(queryTag);
  const [showSettingsButton, setShowSettingsButton] = useState(true);

  useEffect(() => {
    setSearchQuery(querySearch);
    setActiveTag(queryTag);
  }, [querySearch, queryTag]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowSettingsButton(false);
      } else {
        setShowSettingsButton(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCloseModals = () => {
    updateParams({
      delete: null,
      share: null,
    });
  };

  const handleEditRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}/edit`);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    updateParams({ delete: recipeId });
  };

  const confirmDeleteRecipe = async () => {
    if (deleteRecipeId) {
      await deleteRecipe(deleteRecipeId);

      handleCloseModals();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateParams({ q: value || null });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    updateParams({ q: null });
  };

  const handleTagChange = (value: string) => {
    setActiveTag(value);
    updateParams({ tag: value === "all" ? null : value });
  };

  const allTags = getAllKeywords();
  const filteredRecipes = filterRecipes(searchQuery, activeTag);
  const recipeToDelete = deleteRecipeId ? getRecipeById(deleteRecipeId) : null;

  return (
    <div className="container mx-auto py-6 px-4 pt-18 md:px-6 space-y-2">
      {isSmallDevice ? (
        <>
          <div className="fixed top-6 right-4 md:right-8 z-50">
            {showSettingsButton && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="settings-button"
              >
                <Link to="/settings" title={t("settings.title")}>
                  <Settings />
                </Link>
              </Button>
            )}
          </div>

          <div className="fixed right-4 md:right-6 z-50 flex flex-col items-end gap-4 bottom-[calc(92px+1rem)]">
            <Button
              asChild
              size="icon"
              className="add-recipe-button bg-orange-600 hover:bg-orange-700 dark:text-white"
            >
              <Link to="/recipes/create" title={t("common.addRecipe")}>
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <RecipeList
            recipes={filteredRecipes}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
          {/* <MobileSearchDrawer
            searchQuery={searchQuery}
            activeTag={activeTag}
            allTags={allTags}
            isLoading={isLoading}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            onTagChange={handleTagChange}
          /> */}
          <BottomSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />
        </>
      ) : (
        <DesktopRecipeNotebook
          searchQuery={searchQuery}
          activeTag={activeTag}
          allTags={allTags}
          filteredRecipes={filteredRecipes}
          isLoading={isLoading}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onTagChange={handleTagChange}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      <DeleteRecipeDialog
        recipe={recipeToDelete}
        isOpen={!!recipeToDelete}
        onClose={handleCloseModals}
        onConfirm={confirmDeleteRecipe}
      />
    </div>
  );
}
