import { Book, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import PWAInstallPrompt from "../PWAInstallPrompt";

export default function DesktopHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b sticky top-0 bg-background transition-colors z-10">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-2"
          title={t("common.toHomePage")}
        >
          <Book className="h-6 w-6 text-orange-600" />
          <h1 className="font-bold text-xl tracking-tight">
            {t("common.appName")}
          </h1>
        </Link>

        <div className="flex items-center space-x-2">
          <PWAInstallPrompt />
          <Button
            asChild
            className="flex items-center bg-orange-600 hover:bg-orange-700 dark:text-white"
          >
            <Link to="/recipes/create" title={t("common.addRecipe")}>
              <PlusCircle className="h-4 w-4" />
              {t("common.addRecipe")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon">
            <Link to="/settings" title={t("settings.title")}>
              <Settings />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
