import type React from "react";

import RecipeFilters from "@/components/RecipeFilters";
import RecipeList from "@/components/RecipeList";
import SearchBar from "@/components/SearchBar";
import { Recipe } from "@/types/recipe";
import { useTranslation } from "react-i18next";

interface DesktopRecipeNotebookProps {
  searchQuery: string;
  activeTag: string;
  allTags: string[];
  filteredRecipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onTagChange: (value: string) => void;
  onEditRecipe: (recipeId: string) => void;
  onDeleteRecipe: (recipeId: string) => void;
}

export default function DesktopRecipeNotebook({
  searchQuery,
  activeTag,
  allTags,
  filteredRecipes,
  isLoading,
  error,
  onSearchChange,
  onClearSearch,
  onTagChange,
  onEditRecipe,
  onDeleteRecipe,
}: DesktopRecipeNotebookProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("home.loadingRecipes")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-destructive">{error.message}</p>}
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onClearSearch}
        placeholder={t("home.searchPlaceholder")}
      />

      <RecipeFilters
        activeKeyword={activeTag}
        keywords={allTags}
        onKeywordChange={onTagChange}
      />

      <RecipeList
        recipes={filteredRecipes}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onEditRecipe={onEditRecipe}
        onDeleteRecipe={onDeleteRecipe}
      />
    </div>
  );
}
