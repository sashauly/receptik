import type React from "react";
import { useEffect, useRef, useState } from "react";

import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface BottomSearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
}

export default function BottomSearch({
  searchQuery,
  onSearchChange,
  onClearSearch,
}: BottomSearchProps) {
  const { t } = useTranslation();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Chrome 94 and Edge 94 (https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard)
    const virtualKeyboardSupported = "virtualKeyboard" in navigator;

    if (virtualKeyboardSupported) {
      navigator.virtualKeyboard.overlaysContent = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleGeometryChange = (e: any) => {
        setKeyboardHeight(e.target.boundingRect.height);
      };

      navigator.virtualKeyboard.addEventListener(
        "geometrychange",
        handleGeometryChange
      );

      return () => {
        navigator.virtualKeyboard.removeEventListener(
          "geometrychange",
          handleGeometryChange
        );
      };
    }
  }, []);

  const effectivePaddingBottom =
    "virtualKeyboard" in navigator
      ? `calc(1rem + ${keyboardHeight}px)`
      : "1rem";

  return (
    <div
      className={cn("fixed bottom-0 left-0 right-0 z-40 bg-background p-4")}
      style={{ paddingBottom: effectivePaddingBottom }}
    >
      <SearchBar
        ref={searchInputRef}
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onClearSearch}
        placeholder={t("home.searchPlaceholder")}
      />
    </div>
  );
}
