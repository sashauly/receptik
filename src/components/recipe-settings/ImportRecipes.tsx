import RecipePreviewCard from "@/components/RecipePreviewCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { useImportRecipes } from "@/hooks/recipes/useImportRecipe";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Loader2 } from "lucide-react";

const isRecipe = (obj: unknown): obj is Recipe => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof (obj as Recipe).id === "string" &&
    "name" in obj &&
    typeof (obj as Recipe).name === "string" &&
    "ingredients" in obj &&
    Array.isArray((obj as Recipe).ingredients) &&
    "instructions" in obj &&
    Array.isArray((obj as Recipe).instructions)
  );
};

const ensureRecipeIds = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      id: ingredient.id || uuidv4(),
    })),
  };
};

const ImportRecipes = () => {
  const { t } = useTranslation();
  const { importRecipes, loading: isLoading } = useImportRecipes();
  const [recipesToPreview, setRecipesToPreview] = useState<Recipe[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus management for the dialog
  useEffect(() => {
    if (showPreviewDialog && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [showPreviewDialog]);

  const processFileForPreview = useCallback(
    (file: File) => {
      setRecipesToPreview([]);
      setShowPreviewDialog(false);
      setIsProcessing(true);

      if (file.type !== "application/json") {
        toast.error(t("importRecipes.notJsonFile"));
        setIsProcessing(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result;
          if (typeof result !== "string") {
            logError("FileReader result is not a string.");
            toast.error(t("importRecipes.errorReadingFile"));
            return;
          }

          const jsonData: unknown = JSON.parse(result);
          let recipes: Recipe[] = [];

          if (Array.isArray(jsonData)) {
            const validRecipes = jsonData.filter(isRecipe);
            if (validRecipes.length === 0 && jsonData.length > 0) {
              toast.error(t("importRecipes.noValidRecipesInArray"));
              return;
            } else if (validRecipes.length < jsonData.length) {
              toast.warning(t("importRecipes.someInvalidRecipes"));
            }
            recipes = validRecipes.map(ensureRecipeIds);
          } else if (isRecipe(jsonData)) {
            recipes = [ensureRecipeIds(jsonData)];
          } else {
            toast.error(t("importRecipes.invalidJsonFormat"));
            return;
          }

          if (recipes.length === 0) {
            toast.info(t("importRecipes.noValidRecipesFound"));
            return;
          }

          setRecipesToPreview(recipes);
          setShowPreviewDialog(true);
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
    [t]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      processFileForPreview(file);
    } else {
      setRecipesToPreview([]);
      setShowPreviewDialog(false);
    }
  };

  const handleImportConfirmed = useCallback(async () => {
    if (recipesToPreview.length === 0) {
      toast.error(t("importRecipes.noRecipesToImport"));
      return;
    }

    try {
      await importRecipes(recipesToPreview);
      toast.success(
        t("importRecipes.success", { count: recipesToPreview.length })
      );
      setShowPreviewDialog(false);
      setRecipesToPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      logError("Error importing recipes:", error);
      toast.error(t("importRecipes.importFailed"));
    }
  }, [importRecipes, recipesToPreview, t]);

  const handleClosePreview = useCallback(() => {
    setShowPreviewDialog(false);
    setRecipesToPreview([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClosePreview();
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-2"
      role="region"
      aria-label={t("settings.importRecipes")}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium" id="import-recipes-section-label">
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
        <input
          id="import-recipes"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="sr-only"
          aria-label={t("importRecipes.selectFile")}
          aria-describedby="import-recipes-desc"
          tabIndex={-1}
        />
        <Button
          asChild
          variant="outline"
          disabled={isProcessing || isLoading}
          aria-busy={isProcessing || isLoading}
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
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("importRecipes.processing")}
              </>
            ) : (
              t("importRecipes.selectFile")
            )}
          </Label>
        </Button>
      </div>

      {showPreviewDialog && (
        <ResponsiveDialog
          open={showPreviewDialog}
          onOpenChange={handleClosePreview}
        >
          <ResponsiveDialogContent
            ref={dialogRef}
            className="sm:max-w-[425px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-dialog-title"
            aria-describedby="preview-dialog-description"
            onKeyDown={handleKeyDown}
          >
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle id="preview-dialog-title">
                {t("importRecipes.previewTitle")}
              </ResponsiveDialogTitle>
              <ResponsiveDialogDescription id="preview-dialog-description">
                {t("importRecipes.previewDescription")}
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>
            <div
              className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto"
              role="list"
              aria-label={t("importRecipes.previewList")}
            >
              {recipesToPreview.map((recipe, index) => (
                <div key={recipe.id || `preview-${index}`} role="listitem">
                  <RecipePreviewCard recipe={recipe} />
                </div>
              ))}
            </div>
            <ResponsiveDialogFooter>
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
                disabled={isLoading}
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
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      )}
    </div>
  );
};

export default ImportRecipes;
