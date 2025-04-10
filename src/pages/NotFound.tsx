import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("common.pageNotFound")}
        </h2>
        <p className="text-muted-foreground">{t("common.pageNotFoundDesc")}</p>
      </div>
    </div>
  );
}
