import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ViewModeControlsProps {
  disabled?: boolean;
}

export function ViewModeControls({ disabled }: ViewModeControlsProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const viewMode = settings.viewMode;

  const toggleViewMode = () => {
    updateSettings({ viewMode: viewMode === "grid" ? "list" : "grid" });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("relative transition-all duration-200", "active:scale-95")}
      onClick={toggleViewMode}
      disabled={disabled}
      title={viewMode === "grid" ? t("common.listView") : t("common.gridView")}
    >
      {viewMode === "grid" ? (
        <List className="h-4 w-4" />
      ) : (
        <LayoutGrid className="h-4 w-4" />
      )}
      <span className="sr-only">
        {viewMode === "grid" ? t("common.listView") : t("common.gridView")}
      </span>
    </Button>
  );
}
