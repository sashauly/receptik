import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Button } from "./ui/button";

interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
  delay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, delay = 300 }) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInternalClear = useCallback(() => {
    setSearchTerm("");
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        id="search"
        type="text"
        placeholder={t("common.search")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchTerm && (
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
};

export default React.memo(SearchInput);
