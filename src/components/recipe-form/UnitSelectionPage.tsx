import React, { useMemo } from "react";
import { UnitValue } from "@/lib/measurements";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/SearchInput";

interface UnitSelectionPageProps {
  unitOptions: { value: string | UnitValue; label: string }[];
  selectedUnit: string | UnitValue;
  onSelect: (unit: string | UnitValue) => void;
  onBack: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const UnitSelectionPage: React.FC<UnitSelectionPageProps> = ({
  unitOptions,
  selectedUnit,
  onSelect,
  onBack,
  searchQuery,
  onSearch,
}) => {
  const { t } = useTranslation();

  const filteredUnits = useMemo(() => {
    if (!searchQuery) return unitOptions;

    const query = searchQuery.toLowerCase();
    return unitOptions.filter((unit) =>
      unit.label.toLowerCase().includes(query)
    );
  }, [unitOptions, searchQuery]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col h-full">
      <div className="flex items-center p-4 border-b shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
          aria-label={t("common.back")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{t("forms.selectUnit")}</h2>
      </div>

      <div className="p-4 border-b shrink-0">
        <SearchInput value={searchQuery} onChange={onSearch} />
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 pb-20">
            <div className="space-y-2">
              {filteredUnits.map((unit) => (
                <Button
                  key={unit.value}
                  variant={selectedUnit === unit.value ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => onSelect(unit.value)}
                >
                  {unit.label}
                </Button>
              ))}
              {filteredUnits.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  {t("common.noResultsFound")}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UnitSelectionPage;
