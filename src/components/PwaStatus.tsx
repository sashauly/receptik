import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { WifiOff, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
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
