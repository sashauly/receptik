import { HomeIcon, PlusCircle, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function MobileNavigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const showCreateButton = location.pathname === "/";
  // TODO: Add settings for left-handed users to control the position of the create button
  const isLeftHanded = false;

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 shadow-lg pb-safe">
      <nav aria-label="Main mobile navigation" className="relative">
        {/* Create Recipe Button */}
        {showCreateButton && (
          <div
            className={cn(
              "absolute -top-21",
              isLeftHanded ? "left-4" : "right-4"
            )}
          >
            <Button
              asChild
              variant="default"
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 active:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Link
                to="/recipes/create"
                title={t("common.addRecipe")}
                aria-label={t("common.addRecipe")}
              >
                <PlusCircle className="h-7 w-7" aria-hidden="true" />
                <span className="sr-only">{t("common.addRecipe")}</span>
              </Link>
            </Button>
          </div>
        )}

        {/* Navigation Links */}
        <ul className="flex items-center justify-around py-3 px-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex flex-col items-center gap-1 h-auto py-2 min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive &&
                    "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                  "active:bg-primary/20 active:scale-95 transition-transform"
                )
              }
              aria-label={t("navigation.myRecipes")}
            >
              <HomeIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{t("navigation.myRecipes")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "flex flex-col items-center gap-1 h-auto py-2 min-w-[44px] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive &&
                    "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                  "active:bg-primary/20 active:scale-95 transition-transform"
                )
              }
              aria-label={t("navigation.settings")}
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs">{t("navigation.settings")}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
