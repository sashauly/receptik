import { Book, PlusCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

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

        {isHomePage ? (
          <div className="flex items-center space-x-2">
            <Button
              asChild
              className="flex items-center bg-orange-600 hover:bg-orange-700 dark:text-white"
            >
              <Link to="/?create=true" title={t("common.addRecipe")}>
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
        ) : (
          <Button asChild variant="outline">
            <Link to="/" title={t("common.backToRecipes")}>
              {t("common.backToRecipes")}
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
