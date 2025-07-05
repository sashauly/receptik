import { ModeToggle } from "@/components/ModeToggle";
import { ChevronLeft, PanelsTopLeft } from "lucide-react";
import PWAInstallPrompt from "../PWAInstallPrompt";
import { SidebarTrigger } from "../ui/sidebar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("screen and (max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={cn(
        "sticky w-full top-0 z-100 min-h-[70px]",
        "flex items-center gap-2 py-2 px-4",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {location !== "/" && (
            <Button
              variant="outline"
              size={isMobile ? "icon" : "default"}
              onClick={handleBack}
              className="flex items-center"
              aria-label={t("common.back")}
            >
              <ChevronLeft aria-hidden="true" size={20} />
              <span className="hidden md:inline-block">{t("common.back")}</span>
            </Button>
          )}

          {!isMobile && (
            <SidebarTrigger variant="outline" size="icon">
              <PanelsTopLeft />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
          )}
        </div>

        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        {!isMobile && (
          <>
            <ModeToggle />

            <PWAInstallPrompt />
          </>
        )}
      </div>
    </header>
  );
}
