import type React from "react";

import RecipeList from "@/components/RecipeList";
import RecipeFilters from "@/components/RecipeFilters";
import { Recipe } from "@/types/recipe";
import SearchBar from "@/components/SearchBar";
import { useTranslation } from "react-i18next";

interface DesktopRecipeNotebookProps {
  searchQuery: string;
  activeTag: string;
  allTags: string[];
  filteredRecipes: Recipe[];
  isLoading: boolean;
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
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
        onEditRecipe={onEditRecipe}
        onDeleteRecipe={onDeleteRecipe}
      />
    </div>
  );
}
