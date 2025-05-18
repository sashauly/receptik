"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { logDebug } from "@/lib/utils/logger";
import { useEffect, useState } from "react";

interface InstallPWAButtonProps {
  dialogMessage?: string;
  buttonText?: string;
  dialogTitle?: string;
  dialogInstallButtonText?: string;
  dialogCancelButtonText?: string;
  fallbackInstructions?: React.ReactNode;
}

const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({
  dialogMessage,
  buttonText = "Install App",
  dialogTitle = "Install Our App",
  dialogInstallButtonText = "Install",
  dialogCancelButtonText = "Maybe later",
  fallbackInstructions,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallAvailable, setIsInstallAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const isSupported =
      typeof window !== "undefined" &&
      typeof window.addEventListener !== "undefined";

    if (!isSupported) {
      setShowFallback(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();

      setDeferredPrompt(e);

      setIsInstallAvailable(true);
      setShowFallback(false);
    };

    const isAlreadyInstalled = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (isAlreadyInstalled) {
      setIsInstallAvailable(false);
      setShowFallback(true);
    } else {
      window.addEventListener("beforeinstallprompt", handler);
    }

    window.addEventListener("appinstalled", () => {
      setIsInstallAvailable(false);

      setDeferredPrompt(null);
      toast("The app has been successfully installed.");
      setShowFallback(true);
    });

    return () => {
      if (isSupported) {
        window.removeEventListener("beforeinstallprompt", handler);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (outcome === "accepted") {
      logDebug("User accepted the install prompt");
      toast("Thank you for installing the app!");
    } else {
      logDebug("User dismissed the install prompt");
      toast("You can install the app later.");
    }

    setIsInstallAvailable(false);
    setIsDialogOpen(false);
    setShowFallback(true);
  };

  if (showFallback) {
    return fallbackInstructions || null;
  }

  if (!isInstallAvailable) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() =>
          dialogMessage ? setIsDialogOpen(true) : handleInstallClick()
        }
      >
        {buttonText}
      </Button>

      {dialogMessage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {dialogCancelButtonText}
                </Button>
              </DialogClose>
              <Button onClick={handleInstallClick}>
                {dialogInstallButtonText}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default InstallPWAButton;
