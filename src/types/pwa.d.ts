// Augment the Window interface to include the beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event; // The appinstalled event doesn't have extra properties
  }

  interface BeforeInstallPromptEvent extends Event {
    /**
     * The deferred prompt. It can be stored to show the install prompt later.
     */
    prompt(): Promise<void>;

    /**
     * Returns a Promise that resolves with an object containing the outcome of the user's choice
     * regarding the install prompt.
     */
    userChoice: Promise<{
      outcome: "accepted" | "dismissed";
      platform: string;
    }>;
  }
}

// This ensures the types are available globally without explicit imports
export {};
