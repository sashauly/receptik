/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportAsJson, exportAsTxt } from "@/utils/export";
import type { Recipe } from "@/types/recipe";
import { FileJson, FileText, Image, Share2, Loader2, Copy } from "lucide-react";
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
import { shareRecipeAsText } from "@/utils/share";

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
        {errorMessage && (
          <p className="text-red-500 text-sm px-4">{errorMessage}</p>
        )}

        <ShareTabs recipe={recipe} setErrorMessage={setErrorMessage} />

        <ResponsiveDialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
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
  const [isSharing, setIsSharing] = useState(false);

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const onExportAsJson = () => {
    try {
      exportAsJson(recipe);
      toast.success(t("settings.exportSuccess"));
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const onExportAsTxt = () => {
    try {
      exportAsTxt(recipe, t);
      toast.success(t("share.successTxt") || "Exported as TXT");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const onExportAsImage = () => {
    try {
      exportAsImage(recipe, t);
      toast.success(t("share.successImage") || "Exported as Image");
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const onShareSocial = async () => {
    setIsSharing(true);
    try {
      const result = await shareRecipeAsText(recipe, t);
      if (result === "copied") {
        toast.success(t("share.copiedToClipboard") || "Copied to clipboard!");
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Tabs className="px-4" defaultValue="social">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="social">{t("share.social")}</TabsTrigger>
        <TabsTrigger value="export">{t("share.export")}</TabsTrigger>
      </TabsList>

      {/* Social Tab */}
      <TabsContent value="social" className="space-y-4 pt-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">
              {canNativeShare ? t("share.social") : t("share.copyToClipboard")}
            </h3>
            <p className="text-xs text-muted-foreground italic">
              {canNativeShare
                ? t("share.nativeDescription") ||
                  "Send to apps like WhatsApp, Telegram, or Mail."
                : t("share.copyDescription") ||
                  "Copies the full recipe text so you can paste it anywhere."}
            </p>
          </div>

          <Button
            onClick={onShareSocial}
            disabled={isSharing}
            className="w-full h-12 text-lg gap-2"
          >
            {isSharing ? (
              <Loader2 className="animate-spin" />
            ) : canNativeShare ? (
              <Share2 size={20} />
            ) : (
              <Copy size={20} />
            )}

            {/* Explicit Labeling */}
            {canNativeShare ? t("share.social") : t("share.copyToClipboard")}
          </Button>
        </div>
      </TabsContent>

      {/* Export Tab */}
      <TabsContent value="export" className="space-y-4 pt-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("share.exportThisRecipe")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button
              onClick={onExportAsJson}
              variant="outline"
              className="justify-start sm:justify-center gap-2"
            >
              <FileJson className="h-4 w-4 shrink-0" />
              JSON
            </Button>
            <Button
              onClick={onExportAsTxt}
              variant="outline"
              className="justify-start sm:justify-center gap-2"
            >
              <FileText className="h-4 w-4 shrink-0" />
              {t("share.text")}
            </Button>
            <Button
              onClick={onExportAsImage}
              variant="outline"
              className="justify-start sm:justify-center gap-2"
            >
              <Image className="h-4 w-4 shrink-0" />
              {t("share.image")}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
