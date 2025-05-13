import type React from "react";

import { useState, useEffect } from "react";
import RecipeForm from "@/components/RecipeForm";
import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import { useRecipes } from "@/hooks/useRecipes";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Recipe } from "@/types/recipe";
import { getUniqueSlug } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileSearchDrawer from "./MobileSearchDrawer";
import DesktopRecipeNotebook from "./DesktopRecipeNotebook";
import RecipeList from "@/components/RecipeList";

export default function RecipeNotebook() {
  const {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getAllKeywords,
    filterRecipes,
  } = useRecipes();

  const { getParam, updateParams } = useUrlParams();

  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");

  const querySearch = getParam("q") || "";
  const queryTag = getParam("tag") || "all";
  const showCreateModal = getParam("create") === "true";
  const editRecipeId = getParam("edit");
  const deleteRecipeId = getParam("delete");

  const [searchQuery, setSearchQuery] = useState(querySearch);
  const [activeTag, setActiveTag] = useState(queryTag);

  useEffect(() => {
    setSearchQuery(querySearch);
    setActiveTag(queryTag);
  }, [querySearch, queryTag]);

  const handleCloseModals = () => {
    updateParams({
      create: null,
      edit: null,
      delete: null,
      share: null,
    });
  };

  const handleEditRecipe = (recipeId: string) => {
    updateParams({ edit: recipeId });
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

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (editRecipeId) {
      const otherRecipes = recipes.filter((r) => r.id !== editRecipeId);

      const existingSlugs = otherRecipes
        .map((r) => r.slug)
        .filter((slug): slug is string => slug !== undefined);

      const existingRecipe = getRecipeById(editRecipeId);
      const needsNewSlug =
        !existingRecipe || existingRecipe.name !== recipe.name;

      const slug = needsNewSlug
        ? getUniqueSlug(recipe.name, existingSlugs)
        : (existingRecipe?.slug ?? getUniqueSlug(recipe.name, existingSlugs));

      await updateRecipe(editRecipeId, { ...recipe, slug });
    } else {
      await addRecipe({ ...recipe });
    }

    handleCloseModals();
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
  const editingRecipe = editRecipeId ? getRecipeById(editRecipeId) : null;

  const commonProps = {
    searchQuery,
    activeTag,
    allTags,
    filteredRecipes,
    isLoading,
    onSearchChange: handleSearchChange,
    onClearSearch: handleClearSearch,
    onTagChange: handleTagChange,
    onEditRecipe: handleEditRecipe,
    onDeleteRecipe: handleDeleteRecipe,
    showCreateModal,
    editRecipeId,
    deleteRecipeId,
    onCloseModals: handleCloseModals,
    onSaveRecipe: handleSaveRecipe,
    confirmDeleteRecipe: confirmDeleteRecipe,
    editingRecipe,
    recipeToDelete,
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-2">
      {isSmallDevice ? (
        <>
          <RecipeList
            recipes={filteredRecipes}
            searchQuery={searchQuery}
            onClearSearch={commonProps.onClearSearch}
            onEditRecipe={(recipeId) => {
              commonProps.onEditRecipe(recipeId);
            }}
            onDeleteRecipe={(id) => {
              commonProps.onDeleteRecipe(id);
            }}
          />
          <MobileSearchDrawer {...commonProps} />
        </>
      ) : (
        <DesktopRecipeNotebook {...commonProps} />
      )}

      <RecipeForm
        initialRecipe={editingRecipe}
        isOpen={showCreateModal || !!editRecipeId}
        onClose={handleCloseModals}
        onSave={handleSaveRecipe}
      />

      <DeleteRecipeDialog
        recipe={recipeToDelete}
        isOpen={!!recipeToDelete}
        onClose={handleCloseModals}
        onConfirm={confirmDeleteRecipe}
      />
    </div>
  );
}
