import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info, WifiHigh, WifiOff } from "lucide-react";

const FEATURE_APIS = [
  {
    name: "Virtual Keyboard API",
    key: "virtualKeyboard",
    supported: () => "virtualKeyboard" in navigator,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Virtual_Keyboard_API",
  },
  {
    name: "LocalStorage",
    key: "localStorage",
    supported: () => "localStorage" in window && window.localStorage !== null,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
  },
  {
    name: "IndexedDB",
    key: "indexedDB",
    supported: () => "indexedDB" in window,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API",
  },
  {
    name: "Service Worker",
    key: "serviceWorker",
    supported: () => "serviceWorker" in navigator,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker_API",
  },
  {
    name: "Notifications",
    key: "Notification",
    supported: () => "Notification" in window,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/notification",
  },
  {
    name: "Clipboard API",
    key: "clipboard",
    supported: () => "clipboard" in navigator,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API",
  },
  {
    name: "Share API",
    key: "share",
    supported: () => {
      if (!navigator.share || !navigator.canShare) return false;
      try {
        return navigator.canShare({
          title: "Receptik",
          text: "Check out this awesome recipe!",
        });
      } catch {
        return false;
      }
    },
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share",
  },
  {
    name: "File System Access API",
    key: "showOpenFilePicker",
    supported: () => "showOpenFilePicker" in window,
    mdn: "https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API",
  },
];

export default function DebugInfo() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const { recipes } = useRecipes();

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const featureResults = FEATURE_APIS.map((api) => {
    let supported: boolean | null = null;
    try {
      supported = api.supported();
    } catch {
      supported = null;
    }
    return { ...api, supported };
  });

  return (
    <div>
      <summary className="block mb-2">
        <h3 className="text-sm font-medium">Debug Info</h3>
      </summary>
      <details className="text-muted-foreground space-y-1 text-sm">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-mono">Basic Info: </h4>
          <p>User Agent: {navigator.userAgent}</p>
          <p>
            Platform/OS:{" "}
            {/*@ts-expect-error Property 'userAgentData' does not exist on type 'Navigator'. Did you mean 'userAgent'?ts(2551)*/}
            {navigator.userAgentData
              ? // @ts-expect-error Property 'userAgentData' does not exist on type 'Navigator'. Did you mean 'userAgent'?ts(2551)
                navigator.userAgentData.platform
              : navigator.platform}
          </p>
          <p>Browser Language: {navigator.language}</p>
          <p className="flex items-center gap-1">
            Online Status:{" "}
            {navigator.onLine ? (
              <>
                <WifiHigh className="text-green-600" />
                <span className="text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="text-red-600" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </p>
          <p>
            Screen Resolution: {window.screen.width}x{window.screen.height}
          </p>
          <p>
            Viewport Size: {viewport.width}x{viewport.height}
          </p>
        </div>
        <Separator className="my-2" />

        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-mono">Feature Checks: </h4>
          {featureResults.map(({ name, supported, mdn }) => (
            <div key={name} className="flex items-center gap-2">
              <Badge variant={supported ? "secondary" : "destructive"}>
                {supported === true ? (
                  <Check className="inline w-3 h-3 mr-1 text-green-600" />
                ) : supported === false ? (
                  <X className="inline w-3 h-3 mr-1" />
                ) : (
                  <Info className="inline w-3 h-3 mr-1 text-yellow-600" />
                )}
                {name}
              </Badge>
              {mdn && (
                <a
                  href={mdn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-xs text-blue-600 underline align-middle"
                  aria-label={`MDN ${name} documentation`}
                >
                  MDN
                </a>
              )}
            </div>
          ))}
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-mono">App Info: </h4>

          {recipes === null ? (
            <p className="text-destructive">
              {new Error("Error loading recipes.").message}
            </p>
          ) : (
            <p>Number of Recipes: {recipes && recipes.length}</p>
          )}
        </div>
      </details>
    </div>
  );
}
