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
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const virtualKeyboardSupported = "virtualKeyboard" in navigator;
    const currentSearchInput = searchInputRef.current;

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
        // Reset overlaysContent if this is the only component using it
        // navigator.virtualKeyboard.overlaysContent = false;
      };
    } else {
      // Fallback: Adjust based on focus for other browsers
      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => setIsFocused(false);

      // Assuming SearchBar passes ref to the input or exposes focus/blur events
      if (currentSearchInput) {
        currentSearchInput.addEventListener("focus", handleFocus);
        currentSearchInput.addEventListener("blur", handleBlur);
      }

      return () => {
        if (currentSearchInput) {
          currentSearchInput.removeEventListener("focus", handleFocus);
          currentSearchInput.removeEventListener("blur", handleBlur);
        }
      };
    }
  }, []); // Empty dependency array

  // Calculate padding based on API support or focus state
  const effectivePaddingBottom =
    "virtualKeyboard" in navigator
      ? `calc(1rem + ${keyboardHeight}px)`
      : isFocused
        ? "calc(1rem + 200px)" // Example fallback height
        : "1rem";

  return (
    <div
      className={cn("fixed bottom-0 left-0 right-0 z-40 bg-background p-4")}
      style={{ paddingBottom: effectivePaddingBottom }}
    >
      <p className="text-muted-foreground text-center">
        {"virtualKeyboard" in navigator ? "Virtual" : "Physical"} keyboard
        support: {"virtualKeyboard" in navigator ? "✅" : "❌"}
      </p>
      <SearchBar
        ref={searchInputRef}
        value={searchQuery}
        onChange={onSearchChange}
        onClear={onClearSearch}
        placeholder={t("home.searchPlaceholder")}
        // If SearchBar doesn't expose focus/blur, you might need to handle them
        // on the input element directly if you can access it.
      />
    </div>
  );
}
