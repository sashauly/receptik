import { Button, buttonVariants } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog";
import { Trash2 } from "lucide-react";
import { useResetAllData } from "@/hooks/recipes/useResetAllData";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

export default function ResetAllData() {
  const { t } = useTranslation();
  const { resetAll, loading, error } = useResetAllData();
  const labelId = "reset-all-data-label";

  return (
    <div
      className="flex items-center justify-between gap-2"
      role="group"
      aria-labelledby={labelId}
    >
      <div className="flex flex-col gap-1">
        <h3 id={labelId} className="text-sm font-medium mb-2">
          {t("settings.resetAllData")}
        </h3>
        <p id="reset-all-data-desc" className="text-muted-foreground text-sm">
          {t("settings.resetAllDataDesc")}
        </p>
      </div>

      <ResponsiveDialog>
        <ResponsiveDialogTrigger
          className={cn(
            buttonVariants({ variant: "destructive" }),
            "cursor-pointer"
          )}
          aria-label={t("settings.resetAllData")}
          aria-describedby="reset-all-data-desc"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {t("common.reset")}
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {t("settings.resetConfirmationTitle")}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {t("settings.resetConfirmationDescription")}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                const dialog = document.querySelector('[role="dialog"]');
                if (dialog) {
                  (dialog as HTMLDialogElement).close();
                }
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={resetAll}
              disabled={loading}
              aria-busy={loading}
              aria-label={t("common.confirm")}
            >
              {loading ? (
                <Spinner>{t("common.loading")}</Spinner>
              ) : (
                t("common.confirm")
              )}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      {error && (
        <div
          role="alert"
          className="text-destructive ml-2"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
