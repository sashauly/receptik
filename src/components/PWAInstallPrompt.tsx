import { useState } from "react";
import usePWAInstall from "../hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { useTranslation } from "react-i18next";

const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const { canInstall, promptInstall, isInstalled } = usePWAInstall();
  const [showFallback, setShowFallback] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    if (canInstall) {
      promptInstall();
    } else {
      setShowFallback(true);
    }
  };

  return (
    <>
      <Button onClick={handleInstallClick}>
        {canInstall
          ? t("installPrompt.installApp")
          : t("installPrompt.howToInstall")}
      </Button>

      <ResponsiveDialog open={showFallback} onOpenChange={setShowFallback}>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {t("installPrompt.howToInstall")}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {t("installPrompt.installAppDescription")}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <InstallInstructions />
          <ResponsiveDialogFooter>
            <Button variant="outline" onClick={() => setShowFallback(false)}>
              {t("common.cancel")}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  );
};

const InstallInstructions = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4">
      <h4 className="font-semibold">{t("installPrompt.instructions.title")}</h4>
      <ul className="list-disc list-inside space-y-2">
        <li>{t("installPrompt.instructions.chrome")}</li>
        <li>{t("installPrompt.instructions.safari")}</li>
        <li>{t("installPrompt.instructions.other")}</li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        {t("installPrompt.stepsMayVary")}
      </p>
    </div>
  );
};

export default PWAInstallPrompt;
