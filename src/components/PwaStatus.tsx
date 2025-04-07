import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { WifiOff, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = (): void => setIsOnline(true);
    const handleOffline = (): void => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault();
      console.log("beforeinstallprompt event fired");

      try {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      } catch (error) {
        console.error("Error handling beforeinstallprompt:", error);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.warn("No deferredPrompt available");
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
    } catch (error) {
      console.error("Error during install prompt:", error);
    } finally {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {!isOnline && (
        <Alert variant="destructive" className="w-auto">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            You are currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      {isInstallable && (
        <Button
          onClick={handleInstallClick}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
      )}
    </div>
  );
}
