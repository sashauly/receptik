import RecipePreviewCard from "@/components/RecipePreviewCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useImportRecipes } from "@/hooks/recipes/useImportRecipe";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileForPreview = useCallback(
    (file: File) => {
      setRecipesToPreview([]);
      setShowPreviewDialog(false);

      if (file.type !== "application/json") {
        toast.error(t("importRecipes.notJsonFile"));
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
        }
      };

      reader.onerror = (errorEvent) => {
        logError("FileReader error for preview:", errorEvent);
        toast.error(t("importRecipes.errorReadingFile"));
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

  return (
    <>
      <Label htmlFor="import-recipes">{t("settings.importRecipes")}</Label>

      <input
        id="import-recipes"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <Label htmlFor="import-recipes">
        <Button asChild>
          <span>{t("importRecipes.selectFile")}</span>
        </Button>
      </Label>

      {showPreviewDialog && (
        <Dialog open={showPreviewDialog} onOpenChange={handleClosePreview}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("importRecipes.previewTitle")}</DialogTitle>
              <DialogDescription>
                {t("importRecipes.previewDescription")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              {recipesToPreview.map((recipe, index) => (
                <RecipePreviewCard
                  key={recipe.id || `preview-${index}`}
                  recipe={recipe}
                />
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClosePreview}
                disabled={isLoading}
              >
                {t("common.cancel")}
              </Button>
              <Button onClick={handleImportConfirmed} disabled={isLoading}>
                {isLoading
                  ? t("settings.importing")
                  : t("importRecipes.confirmImport", {
                      count: recipesToPreview.length,
                    })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ImportRecipes;
