import type React from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      className,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          ref={ref}
          type="text"
          id="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pl-10 pr-10 ${className}`}
          {...props}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-y-0 right-0"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("common.clear")}</span>
          </Button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
