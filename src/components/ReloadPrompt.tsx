import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logDebug } from "@/utils/logger";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

function ReloadPrompt() {
  const { t } = useTranslation();
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      logDebug("SW Registered: " + r);
    },
    onRegisterError(error) {
      logDebug("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div>
      {(offlineReady || needRefresh) && (
        <Card className="fixed right-0 bottom-0 p-3 m-4 max-w-sm z-50">
          <CardHeader className="p-0 mb-2">
            <CardTitle className="text-lg">
              {offlineReady
                ? t("reloadPrompt.readyForOfflineUse")
                : t("reloadPrompt.newUpdateAvailable")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mb-4 text-sm text-muted-foreground">
            {offlineReady ? (
              <p>{t("reloadPrompt.offlineDescription")}</p>
            ) : (
              <p>{t("reloadPrompt.updateDescription")}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 p-0">
            <Button variant="outline" onClick={() => close()}>
              {t("common.close")}
            </Button>
            {needRefresh && (
              <Button onClick={() => updateServiceWorker(true)}>
                {t("common.reload")}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default ReloadPrompt;
