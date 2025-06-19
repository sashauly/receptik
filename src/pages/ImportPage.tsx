import React from "react";
import ImportRecipes from "@/components/recipe-settings/ImportRecipes";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const ImportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-3xl">
      <header className="flex items-center mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/settings")}
          className="flex items-center"
          aria-label={t("common.back")}
        >
          <ChevronLeft aria-hidden="true" />
          {t("common.back")}
        </Button>
      </header>
      <main className="space-y-6">
        <h1 className="text-2xl font-bold mb-2">
          {t("settings.importRecipes")}
        </h1>
        <p className="text-muted-foreground mb-4">
          {t("settings.importRecipesDesc")}
        </p>
        <ImportRecipes />
      </main>
    </div>
  );
};

export default ImportPage;
