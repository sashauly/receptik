import type React from "react";

import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useAllKeywords } from "@/hooks/recipes/useAllKeywords";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useFilterRecipes } from "@/hooks/recipes/useFilterRecipes";
import { useRecipe } from "@/hooks/recipes/useRecipe";
import { useSearchRecipes } from "@/hooks/recipes/useSearchRecipes";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUrlParams } from "@/hooks/useUrlParams";
import { PlusCircle, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import DesktopHome from "./DesktopHome";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function Home() {
  const { t } = useTranslation();

  const {
    deleteRecipe,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteRecipe();

  const { getParam, updateParams } = useUrlParams();
  const navigate = useNavigate();

  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  const querySearch = getParam("q") || "";
  const queryTag = getParam("tag") || "all";
  const deleteRecipeId = getParam("delete");

  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [activeTag, setActiveTag] = useState(queryTag);

  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
  } = useSearchRecipes(searchQuery);

  const filterOptions = useMemo(() => {
    return {
      category: undefined,
      cuisine: undefined,
      keywords: activeTag === "all" ? [] : [activeTag],
    };
  }, [activeTag]);

  const {
    filteredResults,
    loading: filterLoading,
    error: filterError,
  } = useFilterRecipes(filterOptions);

  const recipesToDisplay = searchQuery ? searchResults : filteredResults;
  const loading = searchQuery ? searchLoading : filterLoading;
  const error = searchQuery ? searchError : filterError;

  const {
    allKeywords,
    loading: keywordsLoading,
    error: keywordsError,
  } = useAllKeywords();

  const {
    recipe: recipeToDelete,
    loading: recipeToDeleteLoading,
    error: recipeToDeleteError,
  } = useRecipe({ id: deleteRecipeId || undefined });

  useEffect(() => {
    setSearchQuery(querySearch);
    setActiveTag(queryTag);
  }, [querySearch, queryTag]);

  const handleCloseModals = () => {
    updateParams({
      delete: null,
      share: null,
    });
  };

  const handleEditRecipe = (recipeSlug: string) => {
    navigate(`/recipes/${recipeSlug}/edit`);
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

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-2">
      {isSmallDevice ? (
        <>
          <div className="flex items-center justify-between gap-2 mb-4">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              placeholder={t("home.searchPlaceholder")}
            />

            <PWAInstallPrompt />

            <Button
              asChild
              size="icon"
              className="add-recipe-button bg-orange-600 hover:bg-orange-700 dark:text-white"
            >
              <Link to="/recipes/create" title={t("common.addRecipe")}>
                <PlusCircle className="h-4 w-4" />
              </Link>
            </Button>

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
          </div>

          <RecipeList
            recipes={recipesToDisplay}
            isLoading={loading}
            error={error}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        </>
      ) : (
        <DesktopHome
          searchQuery={searchQuery}
          activeTag={activeTag}
          allTags={allKeywords}
          filteredRecipes={recipesToDisplay}
          isLoading={loading || keywordsLoading}
          error={error || keywordsError}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onTagChange={handleTagChange}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

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
