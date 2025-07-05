import { ContentLayout } from "@/components/layout/ContentLayout";
import DebugInfo from "@/components/recipe-settings/DebugInfo";
import ExportAllRecipes from "@/components/recipe-settings/ExportAllRecipes";
import ImportRecipes from "@/components/recipe-settings/ImportRecipes";
import LocaleSwitcher from "@/components/recipe-settings/LocaleSwitcher";
import ResetAllData from "@/components/recipe-settings/ResetAllData";
import ThemeSelect from "@/components/recipe-settings/ThemeSelect";
import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes();

  return (
    <ContentLayout title={t("settings.title")}>
      <main className="space-y-4">
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
    </ContentLayout>
  );
}
