import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function SearchInput({ value, onChange, className }: SearchInputProps) {
  const { t } = useTranslation();

  const handleInternalClear = React.useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        id="search"
        type="text"
        placeholder={t("common.search")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0"
          onClick={handleInternalClear}
          title={t("common.clear")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t("common.clear")}</span>
        </Button>
      )}
    </div>
  );
}

export default React.memo(SearchInput);
