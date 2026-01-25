/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportAsJson, exportAsTxt } from "@/utils/export";
import type { Recipe } from "@/types/recipe";
import { FileJson, FileText, Image } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { exportAsImage } from "@/utils/exportAsImage";

interface ShareRecipeDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareRecipeDialog({
  recipe,
  open,
  onOpenChange,
}: ShareRecipeDialogProps) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {t("modals.shareRecipe")}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {t("modals.shareRecipeDesc", { recipeTitle: recipe.name })}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <ShareTabs recipe={recipe} setErrorMessage={setErrorMessage} />

        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.close")}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
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
      exportAsTxt(recipe, t);
      // TODO add russian translations
      toast.success("Recipe exported as text");
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const onExportAsImage = () => {
    try {
      exportAsImage(recipe, t);
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
            <Button onClick={onExportAsJson} variant="outline">
              <FileJson />
              JSON
            </Button>
            <Button onClick={onExportAsTxt} variant="outline">
              <FileText />
              {t("share.text")}
            </Button>
            <Button onClick={onExportAsImage} variant="outline">
              <Image />
              {t("share.image")}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
