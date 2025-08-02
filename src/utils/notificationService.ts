import { toast } from "sonner";
import { logDebug, logError, logWarn } from "@/utils/logger";

export const requestNotificationPermission = async (): Promise<
  "granted" | "denied" | "default"
> => {
  if (!("Notification" in window)) {
    logWarn("This browser does not support desktop notification");
    toast.warning("This browser does not support desktop notification");
    return "denied";
  }

  if (Notification.permission === "granted") {
    logDebug("Notifications are enabled");
    toast.success("Notifications are enabled");
    return "granted";
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();

      return permission;
    } catch (error) {
      logError("Error requesting notification permission:", error);
      toast.error("Error requesting notification permission");
      return "denied";
    }
  }

  return Notification.permission;
};

export const sendNotification = async (
  title: string,
  options?: NotificationOptions,
) => {
  const permission = await requestNotificationPermission();

  if (permission === "granted") {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, options);
        })
        .catch((error) => {
          logError(
            "Service Worker registration failed for notification:",
            error,
          );
          toast.error("Service Worker registration failed for notification");

          new Notification(title, options);
        });
    } else {
      new Notification(title, options);
    }
  } else {
    logWarn("Notification permission not granted.");
    toast.warning("Notification permission not granted.");
  }
};
