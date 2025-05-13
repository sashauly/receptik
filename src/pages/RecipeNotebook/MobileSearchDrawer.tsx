import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import RecipeFilters from "@/components/RecipeFilters";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Drawer } from "vaul";

const INITIAL_SNAP_POINT_FALLBACK = "92px";
const INITIAL_SNAP_POINT_THRESHOLD = "143px";

interface MobileRecipeNotebookProps {
  searchQuery: string;
  activeTag: string;
  allTags: string[];
  isLoading: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onTagChange: (value: string) => void;
}

export default function MobileSearchDrawer({
  searchQuery,
  activeTag,
  allTags,
  isLoading,
  onSearchChange,
  onClearSearch,
  onTagChange,
}: MobileRecipeNotebookProps) {
  const { t } = useTranslation();

  const drawerContentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [snapPoints, setSnapPoints] = useState<(number | string)[]>([
    INITIAL_SNAP_POINT_FALLBACK,
    INITIAL_SNAP_POINT_THRESHOLD,
  ]);
  const [currentSnap, setCurrentSnap] = useState<number | string | null>(
    snapPoints[0]
  );
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const calculateSnapPoints = useCallback(() => {
    const drawerContent = drawerContentRef.current;
    if (!drawerContent) {
      return;
    }

    const alwaysVisibleContent = drawerContent.querySelector(
      '[data-part="always-visible"]'
    ) as HTMLElement | null;
    const scrollableContent = drawerContent.querySelector(
      '[data-part="scrollable-content"]'
    ) as HTMLElement | null;
    const dragHandle = drawerContent.querySelector(
      '[data-part="drag-handle"]'
    ) as HTMLElement | null;

    let initialHeight = 0;
    if (alwaysVisibleContent) {
      const style = getComputedStyle(alwaysVisibleContent);
      initialHeight =
        alwaysVisibleContent.offsetHeight +
        parseInt(style.marginTop, 10) +
        parseInt(style.marginBottom, 10);

      if (dragHandle) {
        const dragHandleStyle = getComputedStyle(dragHandle);
        initialHeight +=
          dragHandle.offsetHeight +
          parseInt(dragHandleStyle.marginTop, 10) +
          parseInt(dragHandleStyle.marginBottom, 10);
      }
    }

    let scrollableHeight = 0;
    if (scrollableContent) {
      const style = getComputedStyle(scrollableContent);
      scrollableHeight =
        scrollableContent.offsetHeight +
        parseInt(style.marginTop, 10) +
        parseInt(style.marginBottom, 10);
    }

    const fullContentHeight = initialHeight + scrollableHeight;

    const newSnapPoints: (number | string)[] = [];

    const initialSnapPointValue =
      initialHeight > 0 ? `${initialHeight}px` : INITIAL_SNAP_POINT_FALLBACK;
    newSnapPoints.push(initialSnapPointValue);

    const fullContentSnapPointValue =
      fullContentHeight > 0
        ? `${fullContentHeight}px`
        : INITIAL_SNAP_POINT_THRESHOLD;
    newSnapPoints.push(fullContentSnapPointValue);

    if (
      newSnapPoints.length !== snapPoints.length ||
      newSnapPoints.some((point, i) => point !== snapPoints[i])
    ) {
      setSnapPoints(newSnapPoints);
    }
  }, [snapPoints]);

  useEffect(() => {
    const handleViewportChange = () => {
      const visualViewportHeight = window.visualViewport?.height;
      const initialViewportHeight = window.innerHeight;

      if (
        visualViewportHeight &&
        visualViewportHeight < initialViewportHeight
      ) {
        setIsKeyboardOpen(true);
        const keyboardHeight = initialViewportHeight - visualViewportHeight;

        document.documentElement.style.setProperty(
          "--keyboard-height",
          `${keyboardHeight}px`
        );
      } else {
        setIsKeyboardOpen(false);

        document.documentElement.style.removeProperty("--keyboard-height");
      }
    };

    window.visualViewport?.addEventListener("resize", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );
    };
  }, []);

  useEffect(() => {
    const drawerContent = drawerContentRef.current;
    if (!drawerContent) {
      return;
    }

    const resizeObserver = new ResizeObserver(calculateSnapPoints);

    resizeObserver.observe(drawerContent);

    calculateSnapPoints();

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateSnapPoints]);

  useEffect(() => {
    const secondSnapPoint = snapPoints[1];

    if (
      currentSnap === secondSnapPoint &&
      secondSnapPoint !== INITIAL_SNAP_POINT_THRESHOLD
    ) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [currentSnap, snapPoints]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        {t("home.loadingRecipes")}
      </div>
    );
  }

  return (
    <Drawer.Root
      data-slot="drawer"
      open={true}
      onOpenChange={() => {}}
      snapPoints={snapPoints}
      activeSnapPoint={currentSnap}
      setActiveSnapPoint={setCurrentSnap}
      modal={false}
      dismissible={false}
      snapToSequentialPoint
    >
      <Drawer.Portal data-slot="drawer-portal">
        {/* Overlay only if not in the smallest snap point?*/}
        {/* {!isKeyboardOpen && currentSnap !== snapPoints[0] && (
            <Drawer.Overlay
                data-slot="drawer-overlay"
                className={cn(
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
                )}
              />
        )} */}

        <Drawer.Content
          ref={drawerContentRef}
          data-testid="content"
          data-slot="drawer-content"
          className={cn(
            "group/drawer-content z-50 bg-background rounded-t-lg",
            "flex flex-col h-full",

            "fixed left-0 right-0 data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
            isKeyboardOpen ? "bottom-[var(--keyboard-height,0px)]" : "bottom-0"
          )}
        >
          <div
            data-part="drag-handle"
            className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
          />
          <div
            data-part="always-visible"
            className="flex flex-col mx-auto w-full p-4"
          >
            <Drawer.Title className="sr-only">Search and Filter</Drawer.Title>
            <Drawer.Description className="sr-only">
              Type to filter recipes
            </Drawer.Description>
            <SearchBar
              ref={searchInputRef}
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onClearSearch}
              placeholder={t("home.searchPlaceholder")}
            />
          </div>

          <div
            data-part="scrollable-content"
            className={cn("flex flex-col mx-auto w-full px-4", {
              "overflow-y-auto":
                currentSnap === snapPoints[1] && !isKeyboardOpen,
              "overflow-hidden":
                currentSnap !== snapPoints[1] || isKeyboardOpen,
            })}
          >
            <RecipeFilters
              activeKeyword={activeTag}
              keywords={allTags}
              onKeywordChange={onTagChange}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
