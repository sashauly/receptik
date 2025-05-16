import DebugInfo from "@/components/recipe-settings/DebugInfo";
import ImportRecipes from "@/components/recipe-settings/ImportRecipes";
import LocaleSwitcher from "@/components/recipe-settings/LocaleSwitcher";
import ThemeSelect from "@/components/recipe-settings/ThemeSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { deleteAllRecipes } from "@/data/recipeService";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { exportAllRecipesAsJson } from "@/lib/utils/export";
import { ChevronLeft, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onExportAllAsJson = () => {
    try {
      exportAllRecipesAsJson(recipes);
      toast.success("All recipes exported as JSON");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const onResetAllData = async () => {
    try {
      await deleteAllRecipes();
      toast.success("All data has been deleted");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err);
      toast.error("Error deleting all data");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {t("settings.title")}
      </h2>
      <div className="flex items-center mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft />
          {t("common.back")}
        </Button>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="space-y-4">
        <ThemeSelect />

        <LocaleSwitcher />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("share.exportAllRecipes")}</h3>
          <Button onClick={onExportAllAsJson} variant="outline">
            <Download className="h-4 w-4" />
            {t("share.exportAllAsJson")}
          </Button>

          <h3 className="text-sm font-medium">{t("settings.resetAllData")}</h3>
          {recipesError && (
            <p className="text-destructive">{recipesError.message}</p>
          )}
          {recipesLoading ? (
            <p>Loading recipes...</p>
          ) : (
            <Button onClick={onResetAllData}>
              <Trash2 className="h-4 w-4" />
              {t("common.reset")}
            </Button>
          )}

          <ImportRecipes />
        </div>
        <Separator />

        <DebugInfo />
      </div>
    </div>
  );
}
