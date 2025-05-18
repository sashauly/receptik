import { useState } from "react";
import usePWAInstall from "../hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const PWAInstallPrompt = () => {
  const { t } = useTranslation();
  const { canInstall, promptInstall, isInstalled } = usePWAInstall();
  const isSmallDevice = useMediaQuery("only screen and (max-width: 768px)");
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

      {isSmallDevice ? (
        <Drawer open={showFallback} onOpenChange={setShowFallback}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("installPrompt.howToInstall")}</DrawerTitle>
              <DrawerDescription>
                {t("installPrompt.installAppDescription")}
              </DrawerDescription>
            </DrawerHeader>
            <InstallInstructions />
            <DrawerFooter>
              <DrawerClose>
                <Button>{t("common.cancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showFallback} onOpenChange={setShowFallback}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("installPrompt.howToInstall")}</DialogTitle>
              <DialogDescription>
                {t("installPrompt.installAppDescription")}
              </DialogDescription>
            </DialogHeader>

            <InstallInstructions />
          </DialogContent>
        </Dialog>
      )}
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
