import SearchInput from "@/components/SearchInput";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ViewModeControls } from "@/components/ViewModeControls";
import { cn } from "@/lib/utils";
import { Recipe } from "@/types/recipe";
import {
  Book,
  Filter,
  HomeIcon,
  PlusCircle,
  // LifeBuoy,
  // MessageCircle,
  Settings,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router";
import { Button } from "../ui/button";

interface SidebarProps {
  currentSearchTerm: string;
  setCurrentSearchTerm: (term: string) => void;
  recipes: Recipe[];
}

export default function SidebarApp({
  currentSearchTerm,
  setCurrentSearchTerm,
  recipes,
}: SidebarProps) {
  const { t } = useTranslation();

  return (
    <Sidebar>
      <SidebarHeader className="min-h-[70px] py-4 flex items-center justify-center">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-primary hover:underline"
        >
          <Book />
          <h1 className={cn("text-2xl font-bold whitespace-nowrap")}>
            {t("common.appName")}
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Button variant="default" asChild className="flex">
                  <Link to="/recipes/create" title={t("common.addRecipe")}>
                    <PlusCircle aria-hidden="true" />
                    {t("common.addRecipe")}
                  </Link>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/">
                    <HomeIcon aria-hidden="true" />

                    {t("navigation.myRecipes")}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center gap-2">
              <Filter />
              {t("common.filters")}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center gap-2">
              <SearchInput
                value={currentSearchTerm}
                onChange={setCurrentSearchTerm}
              />
              <ViewModeControls />
            </div>
            {currentSearchTerm && (
              <p className="text-sm text-muted-foreground">
                {t("recipe.searchResults", { count: recipes.length })}
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* TODO: Add help menu */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/support">
                    <LifeBuoy aria-hidden="true" />
                    {t("navigation.support")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/feedback">
                    <MessageCircle aria-hidden="true" />
                    {t("navigation.feedback")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">
                    <Settings aria-hidden="true" />
                    {t("navigation.settings")}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
