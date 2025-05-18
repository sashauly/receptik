import { logDebug } from "@/lib/utils/logger";
import { useEffect, useState } from "react";

const usePWAInstall = () => {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode (likely installed)
    const checkDisplayMode = () => {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches
      ) {
        setIsInstalled(true);
      } else {
        setIsInstalled(false);
      }
    };

    checkDisplayMode(); // Check on initial load

    const handler = (e: BeforeInstallPromptEvent) => {
      // Only show the prompt if the app is not already installed
      if (!isInstalled) {
        e.preventDefault();
        setInstallPromptEvent(e);
        setCanInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Optional: Listen for the 'appinstalled' event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false); // No need to prompt after installation
      setInstallPromptEvent(null);
      logDebug("PWA was installed");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled]); // Re-run effect if isInstalled changes

  const promptInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      logDebug(`User response to the install prompt: ${outcome}`);
      setInstallPromptEvent(null);
      setCanInstall(false); // Can't prompt again after user choice
      // We don't set isInstalled here immediately,
      // the 'appinstalled' event or display-mode check will update it.
    }
  };

  return {
    canInstall,
    promptInstall,
    isInstalled,
  };
};

export default usePWAInstall;
