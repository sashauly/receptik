import { HomeIcon, PlusCircle, Settings } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function MobileNavigation() {
  const { t } = useTranslation();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg">
      <div className="flex items-center justify-around py-2 px-4">
        <Button asChild variant="ghost">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs">{t("navigation.myRecipes")}</span>
          </NavLink>
        </Button>
        <Button
          asChild
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full -mt-8 shadow-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 active:bg-primary/80"
        >
          <Link to="/recipes/create" title={t("common.addRecipe")}>
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">{t("common.addRecipe")}</span>
          </Link>
        </Button>
        <Button variant="ghost">
          <NavLink to="/settings" className="flex flex-col items-center gap-1">
            <Settings className="h-5 w-5" />
            <span className="text-xs">{t("navigation.settings")}</span>
          </NavLink>
        </Button>
      </div>
    </footer>
  );
}
