/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/useMobile";
import { exportAsImage, exportAsJson, exportAsTxt } from "@/lib/utils/export";
import type { Recipe } from "@/types/recipe";
import { FileJson, FileText, Image } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ShareRecipeDialogProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareRecipeDialog({
  recipe,
  isOpen,
  onClose,
}: ShareRecipeDialogProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("modals.shareRecipe")}</DrawerTitle>
            <DrawerDescription>
              {t("modals.shareRecipeDesc", {
                recipeTitle: `"${recipe.name}"`,
              })}
            </DrawerDescription>
          </DrawerHeader>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <ShareTabs recipe={recipe} setErrorMessage={setErrorMessage} />

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="default">{t("common.close")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modals.shareRecipe")}</DialogTitle>
          <DialogDescription>
            {t("modals.shareRecipeDesc", {
              recipeTitle: `"${recipe.name}"`,
            })}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <ShareTabs recipe={recipe} setErrorMessage={setErrorMessage} />
      </DialogContent>
    </Dialog>
  );
}

interface ShareTabsProps {
  recipe: Recipe;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
}

function ShareTabs({ recipe, setErrorMessage }: ShareTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("export");

  const onExportAsJson = () => {
    try {
      exportAsJson(recipe);
      // TODO add russian translations
      toast.success("Recipe exported as JSON");
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const onExportAsTxt = () => {
    try {
      exportAsTxt(recipe);
      // TODO add russian translations
      toast.success("Recipe exported as text");
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const onExportAsImage = () => {
    try {
      exportAsImage(recipe);
      // TODO add russian translations
      toast.success("Recipe exported as image");
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  return (
    <Tabs
      className="px-4"
      defaultValue="export"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList>
        <TabsTrigger value="export">{t("share.export")}</TabsTrigger>
      </TabsList>

      <TabsContent value="export" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("share.exportThisRecipe")}</h3>
          <div className="flex flex-col items-baseline gap-2 sm:flex-row">
            <Button
              onClick={onExportAsJson}
              variant="outline"
              className="w-full"
            >
              <FileJson className="h-4 w-4" />
              JSON
            </Button>
            <Button
              onClick={onExportAsTxt}
              variant="outline"
              className="w-full"
            >
              <FileText className="h-4 w-4" />
              {t("share.text")}
            </Button>
            <Button
              onClick={onExportAsImage}
              variant="outline"
              className="w-full"
            >
              <Image className="h-4 w-4" />
              {t("share.image")}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
