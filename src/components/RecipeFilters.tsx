import type React from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchBar from "@/components/SearchBar";
import { useTranslation } from "react-i18next";

interface RecipeFiltersProps {
  searchQuery: string;
  activeTag: string;
  tags: string[];
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onTagChange: (value: string) => void;
}

export default function RecipeFilters({
  searchQuery,
  activeTag,
  tags,
  onSearchChange,
  onClearSearch,
  onTagChange,
}: RecipeFiltersProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onClearSearch}
        placeholder={t("home.searchPlaceholder")}
      />

      <div className="overflow-x-auto pb-2">
        <Tabs value={activeTag} onValueChange={onTagChange} className="w-full">
          <TabsList className="min-w-full sm:min-w-0">
            <TabsTrigger value="all">{t("home.allRecipes")}</TabsTrigger>
            {tags &&
              tags.map((tag) => (
                <TabsTrigger key={tag} value={tag}>
                  {tag}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
