import DebugInfo from "@/components/recipe-settings/DebugInfo";
import ImportRecipes from "@/components/recipe-settings/ImportRecipes";
import LocaleSwitcher from "@/components/recipe-settings/LocaleSwitcher";
import ThemeSelect from "@/components/recipe-settings/ThemeSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ExportAllRecipes from "@/components/recipe-settings/ExportAllRecipes";
import ResetAllData from "@/components/recipe-settings/ResetAllData";
import { ChevronLeft } from "lucide-react";

export default function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes();

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

      <main className="space-y-6">
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
            <ImportRecipes />

            <ExportAllRecipes recipes={recipes} />

            <ResetAllData
              recipesLoading={recipesLoading}
              recipesError={recipesError}
            />
          </div>
        </section>

        <Separator />

        <section aria-labelledby="debug-heading">
          <h2 id="debug-heading" className="text-lg font-semibold mb-4">
            {t("settings.debug")}
          </h2>
          <DebugInfo />
        </section>
      </main>
    </div>
  );
}
