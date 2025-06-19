import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RecipePreviewCard from "@/components/RecipePreviewCard";
import RecipeDiffTable from "./RecipeDiffTable";
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

interface ImportDuplicateRecipeCardProps {
  duplicate: Duplicate;
  importedRecipe: Recipe;
  invalid?: Invalid;
  updateDuplicateChoice: (
    index: number,
    choice: "update" | "skip" | "keepBoth"
  ) => void;
  index: number;
}

const ImportDuplicateRecipeCard: React.FC<ImportDuplicateRecipeCardProps> = ({
  duplicate,
  importedRecipe,
  invalid,
  updateDuplicateChoice,
  index,
}) => {
  const { t } = useTranslation();
  return (
    <div
      key={`duplicate-${index}`}
      role="listitem"
      className="border border-warning bg-warning/10 rounded-lg p-4 flex flex-col max-w-full min-w-0"
    >
      <div className="font-semibold text-warning mb-1">
        {t("importRecipes.duplicateTitle", {
          num: index + 1,
          field: duplicate.matchField,
        })}
      </div>
      <div className="text-sm text-warning mb-2">
        {t("importRecipes.duplicatePrompt")}
        <ul className="list-disc ml-5 mt-1">
          <li>
            <b>{t("importRecipes.duplicateUpdate")}</b>:{" "}
            {t("importRecipes.duplicateUpdateDesc")}
          </li>
          <li>
            <b>{t("importRecipes.duplicateSkip")}</b>:{" "}
            {t("importRecipes.duplicateSkipDesc")}
          </li>
          <li>
            <b>{t("importRecipes.duplicateKeepBoth")}</b>:{" "}
            {t("importRecipes.duplicateKeepBothDesc")}
          </li>
        </ul>
      </div>
      <RadioGroup
        value={duplicate.choice}
        onValueChange={(val) =>
          updateDuplicateChoice(index, val as "update" | "skip" | "keepBoth")
        }
        className="flex gap-4 mb-4"
        aria-label="Duplicate handling options"
      >
        <div className="flex items-center gap-1">
          <RadioGroupItem value="update" id={`update-${index}`} />
          <label htmlFor={`update-${index}`}>
            {t("importRecipes.duplicateUpdate")}
          </label>
        </div>
        <div className="flex items-center gap-1">
          <RadioGroupItem value="skip" id={`skip-${index}`} />
          <label htmlFor={`skip-${index}`}>
            {t("importRecipes.duplicateSkip")}
          </label>
        </div>
        <div className="flex items-center gap-1">
          <RadioGroupItem value="keepBoth" id={`keepBoth-${index}`} />
          <label htmlFor={`keepBoth-${index}`}>
            {t("importRecipes.duplicateKeepBoth")}
          </label>
        </div>
      </RadioGroup>
      <Tabs defaultValue="diff" className="w-full">
        <TabsList className="mb-2">
          <TabsTrigger value="existing">
            {t("importRecipes.tabs.existing")}
          </TabsTrigger>
          <TabsTrigger value="imported">
            {t("importRecipes.tabs.imported")}
          </TabsTrigger>
          <TabsTrigger value="diff">{t("importRecipes.tabs.diff")}</TabsTrigger>
        </TabsList>
        <TabsContent value="existing">
          <div className="rounded-lg border bg-background p-4 flex flex-col max-w-full min-w-0">
            <RecipePreviewCard recipe={duplicate.existing} />
          </div>
        </TabsContent>
        <TabsContent value="imported">
          <div className="rounded-lg border bg-background p-4 flex flex-col max-w-full min-w-0">
            {invalid && (
              <div className="mb-2 p-2 rounded bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-xs border border-yellow-300 dark:border-yellow-700">
                <div className="font-semibold mb-1 flex items-center gap-2">
                  {/* warning icon and message */}
                </div>
                <ul className="ml-4 list-disc flex flex-col gap-1 items-start">
                  {Object.entries(invalid.errors).map(([field, message]) => (
                    <li key={field} className="flex gap-2 items-center">
                      <span className="font-semibold">{field}:</span>
                      {/* warning icon */}
                      <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
                        {message}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <RecipePreviewCard
              recipe={importedRecipe}
              invalidFields={invalid ? Object.keys(invalid.errors) : []}
              invalidFieldErrors={invalid ? invalid.errors : {}}
            />
          </div>
        </TabsContent>
        <TabsContent value="diff">
          <div className="text-xs text-muted-foreground mb-2">
            {t("importRecipes.diffDescription1")}{" "}
            <span className="text-red-600 dark:text-red-400">
              {t("importRecipes.diffDescriptionRed")}
            </span>{" "}
            {t("importRecipes.diffDescription2")}{" "}
            <span className="text-green-600 dark:text-green-400">
              {t("importRecipes.diffDescriptionGreen")}
            </span>{" "}
            {t("importRecipes.diffDescription3")}
          </div>
          <RecipeDiffTable
            existing={duplicate.existing}
            imported={importedRecipe}
            invalidFields={invalid ? Object.keys(invalid.errors) : []}
            invalidFieldErrors={invalid ? invalid.errors : {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportDuplicateRecipeCard;
