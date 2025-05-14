import ImportRecipes from "@/components/ImportRecipes";
import ThemeSelect from "@/components/ThemeSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/useRecipes";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import { exportAllRecipesAsJson } from "@/lib/utils/export";
import { ChevronLeft, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function Settings() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { recipes, deleteAllRecipes } = useRecipes();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const onExportAllAsJson = () => {
    try {
      exportAllRecipesAsJson(recipes);
      // TODO add toast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const onResetAllData = async () => {
    try {
      await deleteAllRecipes();
      // TODO add toast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {t("settings.title")}
      </h2>
      <div className="flex items-center mb-4 gap-2">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center"
        >
          <ChevronLeft />
          Back
        </Button>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="space-y-4">
        <ThemeSelect />

        <LocaleSwitcher />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("share.exportAllRecipes")}</h3>
          <Button onClick={onExportAllAsJson} variant="outline">
            <Download className="h-4 w-4" />
            {t("share.exportAllAsJson")}
          </Button>

          <h3 className="text-sm font-medium">{t("settings.resetAllData")}</h3>
          <Button onClick={onResetAllData}>
            <Trash2 className="h-4 w-4" />
            {t("common.reset")}
          </Button>

          <h3 className="text-sm font-medium">{t("settings.importRecipes")}</h3>
          <ImportRecipes />
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Debug Info</h3>
          <div className="text-muted-foreground space-y-1 text-sm">
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
                VirtualKeyboardAPI:{" "}
                {"virtualKeyboard" in navigator ? "✅" : "❌"}
              </p>
              <p>
                LocalStorage Support:{" "}
                {"localStorage" in window && window.localStorage !== null
                  ? "✅"
                  : "❌"}
              </p>
              <p>IndexedDB Support: {"indexedDB" in window ? "✅" : "❌"}</p>
              <p>
                Service Worker Support:{" "}
                {"serviceWorker" in navigator ? "✅" : "❌"}
              </p>
              <p>
                Notifications Support: {"Notification" in window ? "✅" : "❌"}
              </p>
              <p>
                Clipboard API Support: {"clipboard" in navigator ? "✅" : "❌"}
              </p>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-mono">App Info: </h4>
              <p>Number of Recipes: {recipes.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
