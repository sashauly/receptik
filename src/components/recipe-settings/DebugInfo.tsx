import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/recipes/useRecipes";
import { useEffect, useState } from "react";

export default function DebugInfo() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
  } = useRecipes();

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

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
          <p>Online Status: {navigator.onLine ? "Online" : "Offline"}</p>
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
          <p>
            VirtualKeyboardAPI: {"virtualKeyboard" in navigator ? "✅" : "❌"}
          </p>
          <p>
            LocalStorage Support:{" "}
            {"localStorage" in window && window.localStorage !== null
              ? "✅"
              : "❌"}
          </p>
          <p>IndexedDB Support: {"indexedDB" in window ? "✅" : "❌"}</p>
          <p>
            Service Worker Support: {"serviceWorker" in navigator ? "✅" : "❌"}
          </p>
          <p>Notifications Support: {"Notification" in window ? "✅" : "❌"}</p>
          <p>Clipboard API Support: {"clipboard" in navigator ? "✅" : "❌"}</p>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-mono">App Info: </h4>

          {recipesLoading ? (
            <p>Loading recipes...</p>
          ) : (
            <p>Number of Recipes: {recipes.length}</p>
          )}
          {recipesError && (
            <p className="text-destructive">
              Error loading recipes: {recipesError.message}
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
