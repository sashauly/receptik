import React from "react";
import ImportDuplicateRecipeCard from "./ImportDuplicateRecipeCard";
import ImportInvalidRecipeCard from "./ImportInvalidRecipeCard";
import ImportRecipeCard from "./ImportRecipeCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Recipe } from "@/types/recipe";

interface Duplicate {
  index: number;
  existing: Recipe;
  matchField: "id" | "slug" | "name";
  choice: "update" | "skip" | "keepBoth";
}

interface Invalid {
  index: number;
  errors: Record<string, string>;
  validValues: Partial<Recipe>;
}

interface ImportPreviewSectionProps {
  recipesToPreview: Recipe[];
  invalidRecipes: Invalid[];
  duplicates: Duplicate[];
  updateDuplicateChoice: (
    index: number,
    choice: "update" | "skip" | "keepBoth"
  ) => void;
  handleEditInvalid: (
    originalRecipe: Recipe,
    validValues: Partial<Recipe>,
    index: number
  ) => void;
  isLoading: boolean;
  handleImportConfirmed: () => void;
  handleClosePreview: () => void;
}

const ImportPreviewSection: React.FC<ImportPreviewSectionProps> = ({
  recipesToPreview,
  invalidRecipes,
  duplicates,
  updateDuplicateChoice,
  handleEditInvalid,
  isLoading,
  handleImportConfirmed,
  handleClosePreview,
}) => {
  const { t } = useTranslation();
  return (
    <section className="mt-6" aria-label={t("importRecipes.previewTitle")}>
      <header className="mb-4">
        <h4 className="text-xl font-bold mb-1">
          {t("importRecipes.previewTitle")}
        </h4>
        <p className="text-muted-foreground">
          {t("importRecipes.previewDescription")}
        </p>
      </header>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4 overflow-y-auto"
        role="list"
        aria-label={t("importRecipes.previewList")}
      >
        {recipesToPreview.map((recipe, index) => {
          const invalid = invalidRecipes.find((ir) => ir.index === index);
          const duplicate = duplicates.find((d) => d.index === index);
          if (duplicate) {
            return (
              <ImportDuplicateRecipeCard
                key={`duplicate-${index}`}
                duplicate={duplicate}
                importedRecipe={recipesToPreview[index]}
                invalid={invalid}
                updateDuplicateChoice={updateDuplicateChoice}
                index={index}
              />
            );
          } else if (invalid) {
            return (
              <ImportInvalidRecipeCard
                key={`invalid-${index}`}
                index={index}
                invalid={invalid}
                recipe={recipesToPreview[index]}
                onEdit={handleEditInvalid}
              />
            );
          } else {
            return (
              <ImportRecipeCard
                key={recipe.id || `preview-${index}`}
                recipe={recipe}
                index={index}
              />
            );
          }
        })}
      </div>
      <div className="flex flex-row gap-4 justify-end mt-6">
        <Button
          variant="outline"
          onClick={handleClosePreview}
          disabled={isLoading}
          aria-label={t("common.cancel")}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleImportConfirmed}
          disabled={isLoading || invalidRecipes.length > 0}
          aria-label={t("importRecipes.confirmImport", {
            count: recipesToPreview.length,
          })}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("settings.importing")}
            </>
          ) : (
            t("importRecipes.confirmImport", {
              count: recipesToPreview.length,
            })
          )}
        </Button>
      </div>
    </section>
  );
};

export default ImportPreviewSection;
