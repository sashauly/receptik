import type React from "react";

import { useState, useEffect } from "react";
import RecipeList from "@/components/RecipeList";
import RecipeFormModal from "@/components/RecipeFormModal";
import DeleteRecipeDialog from "@/components/DeleteRecipeDialog";
import RecipeFilters from "@/components/RecipeFilters";
import { useRecipes } from "@/hooks/useRecipes";
import { useUrlParams } from "@/hooks/useUrlParams";
import type { Recipe } from "@/types/recipe";
import { getUniqueSlug } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function RecipeNotebook() {
  const {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    getAllTags,
    filterRecipes,
  } = useRecipes();

  const { getParam, updateParams } = useUrlParams();
  const { t } = useTranslation();

  // Get values from URL query parameters
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

  const handleEditRecipe = (recipe: Recipe) => {
    updateParams({ edit: recipe.id });
  };

  const handleDeleteRecipe = (id: string) => {
    updateParams({ delete: id });
  };

  const confirmDeleteRecipe = async () => {
    if (deleteRecipeId) {
      await deleteRecipe(deleteRecipeId);
      // TODO add toast
      handleCloseModals();
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (editRecipeId) {
      // Get all existing recipes to check for slug uniqueness
      const otherRecipes = editRecipeId
        ? recipes.filter((r) => r.id !== editRecipeId)
        : recipes;

      // Get existing slugs
      const existingSlugs = otherRecipes.map((r) => r.slug);

      // Generate a unique slug if needed
      const existingRecipe = editRecipeId ? getRecipeById(editRecipeId) : null;
      const needsNewSlug =
        !existingRecipe || existingRecipe.title !== recipe.title;
      const slug = needsNewSlug
        ? getUniqueSlug(recipe.title, existingSlugs)
        : existingRecipe?.slug || getUniqueSlug(recipe.title, existingSlugs);

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

  // Derived state
  const allTags = getAllTags();
  const filteredRecipes = filterRecipes(searchQuery, activeTag);
  const recipeToDelete = deleteRecipeId ? getRecipeById(deleteRecipeId) : null;
  const editingRecipe = editRecipeId ? getRecipeById(editRecipeId) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("home.loadingRecipes")}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <RecipeFilters
        searchQuery={searchQuery}
        activeTag={activeTag}
        tags={allTags}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onTagChange={handleTagChange}
      />

      <RecipeList
        recipes={filteredRecipes}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
        onEditRecipe={handleEditRecipe}
        onDeleteRecipe={handleDeleteRecipe}
      />

      <RecipeFormModal
        recipe={editingRecipe}
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
