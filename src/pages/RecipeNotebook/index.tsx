import type React from "react";

import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeList from "@/components/RecipeList";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRecipes } from "@/hooks/useRecipes";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DesktopRecipeNotebook from "./DesktopRecipeNotebook";
import MobileSearchDrawer from "./MobileSearchDrawer";

export default function RecipeNotebook() {
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
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-2">
      {isSmallDevice ? (
        <>
          <RecipeList
            recipes={filteredRecipes}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
          <MobileSearchDrawer
            searchQuery={searchQuery}
            activeTag={activeTag}
            allTags={allTags}
            isLoading={isLoading}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            onTagChange={handleTagChange}
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
