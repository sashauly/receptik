import DebugInfo from "@/components/recipe-settings/DebugInfo";
import ImportRecipes from "@/components/recipe-settings/ImportRecipes";
import LocaleSwitcher from "@/components/recipe-settings/LocaleSwitcher";
import ThemeSelect from "@/components/recipe-settings/ThemeSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog";
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
      toast.success(t("settings.exportSuccess"));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : t("settings.exportError");
      setErrorMessage(errorMessage);
      toast.error(t("settings.exportError"));
    }
  };

  const onResetAllData = async () => {
    try {
      await deleteAllRecipes();
      toast.success(t("settings.resetSuccess"));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : t("settings.resetError");
      setErrorMessage(errorMessage);
      toast.error(t("settings.resetError"));
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <header className="flex items-center mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center"
          aria-label={t("common.back")}
        >
          <ChevronLeft aria-hidden="true" />
          {t("common.back")}
        </Button>
      </header>

      {errorMessage && (
        <div role="alert" className="text-destructive">
          {errorMessage}
        </div>
      )}

      <div className="space-y-6">
        <section aria-labelledby="appearance-heading">
          <h2 id="appearance-heading" className="text-lg font-semibold mb-4">
            {t("settings.appearance")}
          </h2>
          <div className="space-y-4">
            <ThemeSelect />
            <LocaleSwitcher />
          </div>
        </section>

        <Separator />

        <section aria-labelledby="data-management-heading">
          <h2
            id="data-management-heading"
            className="text-lg font-semibold mb-4"
          >
            {t("settings.dataManagement")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium mb-2">
                {t("share.exportAllRecipes")}
              </h3>
              <Button
                onClick={onExportAllAsJson}
                variant="outline"
                aria-label={t("share.exportAllAsJson")}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("share.exportAllAsJson")}
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-medium mb-2">
                {t("settings.resetAllData")}
              </h3>
              {recipesError && (
                <p className="text-destructive" role="alert">
                  {(recipesError as Error).message}
                </p>
              )}
              {recipesLoading ? (
                <p>{t("common.loading")}</p>
              ) : (
                <ResponsiveDialog>
                  <ResponsiveDialogTrigger>
                    <Button
                      variant="destructive"
                      aria-label={t("settings.resetAllData")}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {t("common.reset")}
                    </Button>
                  </ResponsiveDialogTrigger>
                  <ResponsiveDialogContent>
                    <ResponsiveDialogHeader>
                      <ResponsiveDialogTitle>
                        {t("settings.resetConfirmationTitle")}
                      </ResponsiveDialogTitle>
                      <ResponsiveDialogDescription>
                        {t("settings.resetConfirmationDescription")}
                      </ResponsiveDialogDescription>
                    </ResponsiveDialogHeader>
                    <ResponsiveDialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const dialog =
                            document.querySelector('[role="dialog"]');
                          if (dialog) {
                            (dialog as HTMLDialogElement).close();
                          }
                        }}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button variant="destructive" onClick={onResetAllData}>
                        {t("common.confirm")}
                      </Button>
                    </ResponsiveDialogFooter>
                  </ResponsiveDialogContent>
                </ResponsiveDialog>
              )}
            </div>

            <ImportRecipes />
          </div>
        </section>

        <Separator />

        <section aria-labelledby="debug-heading">
          <h2 id="debug-heading" className="text-lg font-semibold mb-4">
            {t("settings.debug")}
          </h2>
          <DebugInfo />
        </section>
      </div>
    </div>
  );
}
