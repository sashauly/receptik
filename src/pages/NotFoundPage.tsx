import { ContentLayout } from "@/components/layout/ContentLayout";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <ContentLayout title={t("common.pageNotFound")}>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("common.pageNotFound")}
        </h2>
        <p className="text-muted-foreground">{t("common.pageNotFoundDesc")}</p>
      </div>
    </ContentLayout>
  );
}
