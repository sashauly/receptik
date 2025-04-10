import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface NoResultsProps {
  searchQuery: string;
  onClear: () => void;
}

export default function NoResults({ searchQuery, onClear }: NoResultsProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{t("common.noRecipesFound")}</h3>
      <p className="text-muted-foreground mb-4">
        {t("common.noRecipesFoundDesc", { searchQuery })}
      </p>
      <Button variant="outline" onClick={onClear}>
        {t("common.clear")}
      </Button>
    </div>
  );
}
