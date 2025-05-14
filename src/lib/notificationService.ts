export const requestNotificationPermission = async (): Promise<
  "granted" | "denied" | "default"
> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  return Notification.permission;
};

export const sendNotification = async (
  title: string,
  options?: NotificationOptions
) => {
  const permission = await requestNotificationPermission();

  if (permission === "granted") {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.showNotification(title, options);
        })
        .catch((error) => {
          console.error(
            "Service Worker registration failed for notification:",
            error
          );

          new Notification(title, options);
        });
    } else {
      new Notification(title, options);
    }
  } else {
    console.warn("Notification permission not granted.");
  }
};
