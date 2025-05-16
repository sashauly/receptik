import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImportRecipes } from "@/hooks/recipes/useImportRecipe";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ImportRecipes = () => {
  const { t } = useTranslation();
  const { importRecipes, loading: isLoading } = useImportRecipes();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = useCallback(async () => {
    if (!selectedFile) {
      toast("Please select a JSON file.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);

          // TODO handle array or object
          await importRecipes([jsonData] as Recipe[]);
          toast("Recipes imported successfully!");
        } catch (parseError) {
          logError("Error parsing JSON:", parseError);
          toast("Error parsing JSON file.");
        }
      };

      reader.onerror = () => {
        toast("Error reading file.");
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      logError("Error importing recipes:", error);
      toast("Import failed.  See console for details.");
    }
  }, [importRecipes, selectedFile]);

  return (
    <div className="flex flex-col w-full max-w-sm space-y-2">
      <Label htmlFor="import-recipes">{t("settings.importRecipes")}</Label>
      <div className="flex items-center gap-2 w-full max-w-sm">
        <Input
          id="import-recipes"
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
        <Button
          type="submit"
          variant="outline"
          onClick={handleImport}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? t("settings.importing") : t("settings.importRecipes")}
        </Button>
      </div>
    </div>
  );
};

export default ImportRecipes;
