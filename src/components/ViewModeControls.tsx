import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { LayoutGrid, List } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ViewModeControlsProps {
  disabled?: boolean;
}

export function ViewModeControls({ disabled }: ViewModeControlsProps) {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const viewMode = settings.viewMode;

  const setGridView = () => updateSettings({ viewMode: "grid" });
  const setListView = () => updateSettings({ viewMode: "list" });

  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="icon"
        onClick={setGridView}
        disabled={disabled}
        title={t("common.gridView")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">{t("common.gridView")}</span>
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="icon"
        onClick={setListView}
        disabled={disabled}
        title={t("common.listView")}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">{t("common.listView")}</span>
      </Button>
    </div>
  );
}
