import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useImportRecipes } from "@/hooks/recipes/useImportRecipe";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createRecipeFormSchema } from "@/data/schema";
import { TFunction } from "i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { getAllRecipes } from "@/data/recipeService";
import { v4 as uuidv4 } from "uuid";
import ImportPreviewSection from "./import-flow/ImportPreviewSection";

// FileInputButton component
interface FileInputButtonProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const FileInputButton = forwardRef<
  HTMLInputElement | null,
  FileInputButtonProps
>(({ onFileChange, disabled }, ref) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => fileInputRef.current!);

  return (
    <>
      <input
        id="import-recipes"
        type="file"
        accept=".json"
        onChange={onFileChange}
        ref={fileInputRef}
        className="sr-only"
        aria-label={t("importRecipes.selectFile")}
        aria-describedby="import-recipes-desc"
        tabIndex={-1}
      />
      <Button
        asChild
        variant="outline"
        disabled={disabled}
        aria-busy={disabled}
      >
        <Label
          htmlFor="import-recipes"
          className="cursor-pointer"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          {disabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("importRecipes.processing")}
            </>
          ) : (
            t("importRecipes.selectFile")
          )}
        </Label>
      </Button>
    </>
  );
});
FileInputButton.displayName = "FileInputButton";

const ImportRecipes = () => {
  const { t } = useTranslation();
  const { importRecipes, loading: isLoading } = useImportRecipes();
  const [recipesToPreview, setRecipesToPreview] = useState<Recipe[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const showPreviewDialog = searchParams.get("importPreview") === "1";
  const [isProcessing, setIsProcessing] = useState(false);
  const [invalidRecipes, setInvalidRecipes] = useState<
    {
      index: number;
      errors: Record<string, string>;
      validValues: Partial<Recipe>;
    }[]
  >([]);
  const [duplicates, setDuplicates] = useState<
    {
      index: number;
      existing: Recipe;
      matchField: "id" | "slug" | "name";
      choice: "update" | "skip" | "keepBoth";
    }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle updated recipe returned from edit page
  useEffect(() => {
    const state = location.state as
      | { updatedRecipe?: Recipe; index?: number }
      | undefined;
    if (
      state &&
      typeof state.updatedRecipe === "object" &&
      typeof state.index === "number"
    ) {
      setRecipesToPreview((prev) => {
        const updated = [...prev];
        updated[state.index!] = state.updatedRecipe as Recipe;
        // Re-validate all recipes after update
        const { invalidRecipes } = validateRecipes(updated, t);
        setInvalidRecipes(invalidRecipes);
        return updated;
      });
      // Clear the state so it doesn't trigger again
      navigate(location.pathname, { replace: true, state: {} });
      setSearchParams({
        ...Object.fromEntries(searchParams),
        importPreview: "1",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const processFileForPreview = useCallback(
    async (file: File) => {
      setRecipesToPreview([]);
      setSearchParams({
        ...Object.fromEntries(searchParams),
        importPreview: "1",
      });
      setIsProcessing(true);

      if (file.type !== "application/json") {
        toast.error(t("importRecipes.notJsonFile"));
        setIsProcessing(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const fileResult = event.target?.result;
          if (typeof fileResult !== "string") {
            logError("FileReader result is not a string.");
            toast.error(t("importRecipes.errorReadingFile"));
            return;
          }

          const jsonData: unknown = JSON.parse(fileResult);
          let recipes: Recipe[] = [];

          if (Array.isArray(jsonData)) {
            recipes = jsonData as Recipe[];
          } else {
            recipes = [jsonData as Recipe];
          }

          const { invalidRecipes } = validateRecipes(recipes, t);
          setRecipesToPreview(recipes);
          setInvalidRecipes(invalidRecipes);

          // Duplicate detection
          const existingRecipes = await getAllRecipes();
          const newDuplicates: typeof duplicates = [];
          recipes.forEach((imported, idx) => {
            let matchField: "id" | "slug" | "name" | null = null;
            let existing: Recipe | undefined;
            if (
              imported.id &&
              (existing = existingRecipes.find((r) => r.id === imported.id))
            ) {
              matchField = "id";
            } else if (
              imported.slug &&
              (existing = existingRecipes.find((r) => r.slug === imported.slug))
            ) {
              matchField = "slug";
            } else if (
              imported.name &&
              (existing = existingRecipes.find((r) => r.name === imported.name))
            ) {
              matchField = "name";
            }
            if (existing && matchField) {
              newDuplicates.push({
                index: idx,
                existing,
                matchField,
                choice: "update",
              });
            }
          });
          setDuplicates(newDuplicates);
        } catch (parseError) {
          logError("Error parsing JSON for preview:", parseError);
          toast.error(t("importRecipes.errorParsingJson"));
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = (errorEvent) => {
        logError("FileReader error for preview:", errorEvent);
        toast.error(t("importRecipes.errorReadingFile"));
        setIsProcessing(false);
      };

      reader.readAsText(file);
    },
    [searchParams, setSearchParams, t]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      processFileForPreview(file);
    } else {
      setRecipesToPreview([]);
      setSearchParams({
        ...Object.fromEntries(searchParams),
        importPreview: "0",
      });
    }
  };

  // Helper to update duplicate choice
  const updateDuplicateChoice = (
    index: number,
    choice: "update" | "skip" | "keepBoth"
  ) => {
    setDuplicates((prev) =>
      prev.map((dup) => (dup.index === index ? { ...dup, choice } : dup))
    );
  };

  const handleImportConfirmed = useCallback(async () => {
    if (recipesToPreview.length === 0) {
      toast.error(t("importRecipes.noRecipesToImport"));
      return;
    }

    // Prepare recipes to import based on duplicate choices
    const recipesToImport = recipesToPreview.filter((recipe, idx) => {
      const dup = duplicates.find((d) => d.index === idx);
      if (!dup) return true; // not a duplicate
      if (dup.choice === "skip") return false;
      if (dup.choice === "keepBoth") {
        recipe.id = uuidv4();
        recipe.slug =
          recipe.slug + "-copy-" + Math.random().toString(36).slice(2, 6);
      }
      // For 'update', keep id/slug as is
      return true;
    });
    try {
      await importRecipes(recipesToImport);
      toast.success(
        t("importRecipes.success", { count: recipesToImport.length })
      );
      setSearchParams({
        ...Object.fromEntries(searchParams),
        importPreview: "0",
      });
      setRecipesToPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      logError("Error importing recipes:", error);
      toast.error(t("importRecipes.importFailed"));
    }
  }, [
    importRecipes,
    recipesToPreview,
    searchParams,
    setSearchParams,
    t,
    duplicates,
  ]);

  const handleClosePreview = useCallback(() => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      importPreview: "0",
    });
    setRecipesToPreview([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [searchParams, setSearchParams]);

  // Add a handler for editing invalid recipes
  const handleEditInvalid = (
    originalRecipe: Recipe,
    validValues: Partial<Recipe>,
    index: number
  ) => {
    navigate("/import/edit", {
      state: {
        originalRecipe,
        validValues,
        index,
      },
    });
  };

  const showPreview = showPreviewDialog;

  return (
    <div
      className="flex flex-col gap-6"
      role="region"
      aria-label={t("settings.importRecipes")}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold" id="import-recipes-section-label">
          {t("settings.importRecipes")}
        </h3>
        <p
          className="text-muted-foreground text-sm mb-2"
          id="import-recipes-desc"
        >
          {t("settings.importRecipesDesc")}
        </p>
      </div>
      <div
        className="flex items-center gap-4"
        role="group"
        aria-labelledby="import-recipes-section-label"
      >
        <FileInputButton
          onFileChange={handleFileChange}
          disabled={isProcessing || isLoading}
          ref={fileInputRef}
        />
      </div>

      {showPreview && (
        <ImportPreviewSection
          recipesToPreview={recipesToPreview}
          invalidRecipes={invalidRecipes}
          duplicates={duplicates}
          updateDuplicateChoice={updateDuplicateChoice}
          handleEditInvalid={handleEditInvalid}
          isLoading={isLoading}
          handleImportConfirmed={handleImportConfirmed}
          handleClosePreview={handleClosePreview}
        />
      )}
    </div>
  );
};

// Validate recipes using Zod and return valid and invalid recipes with error messages
function validateRecipes(
  recipes: Recipe[],
  t: TFunction<"translation", undefined>
) {
  const schema = createRecipeFormSchema(t);
  const validRecipes: Recipe[] = [];
  const invalidRecipes: Array<{
    index: number;
    errors: Record<string, string>;
    validValues: Partial<Recipe>;
  }> = [];
  recipes.forEach((recipe, idx) => {
    const result = schema.safeParse(recipe);
    if (result.success) {
      validRecipes.push(recipe);
    } else {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path.join(".")] = err.message;
        }
      });
      const validValues: Partial<Recipe> = { ...recipe };
      const schemaKeys = Object.keys(schema.shape);

      // 1. Delete all fields in errors
      Object.keys(errors).forEach((field) => {
        const topField = field.split(".")[0];
        if (topField in validValues) {
          delete (validValues as Partial<Recipe>)[topField as keyof Recipe];
        }
      });

      // 2. Delete any field not in schema
      Object.keys(validValues).forEach((key) => {
        if (!schemaKeys.includes(key)) {
          delete (validValues as Partial<Recipe>)[key as keyof Recipe];
        }
      });

      invalidRecipes.push({ index: idx, errors, validValues });
    }
  });
  return { validRecipes, invalidRecipes };
}

export default ImportRecipes;
