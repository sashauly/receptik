import { useTranslation } from "react-i18next";

export default function Footer() {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "common" });

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString(i18n.resolvedLanguage, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="bg-background transition-colors border-t mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>
            {`© ${currentYear} ${t("appName")}. ${t("allRightsReserved")}`}
          </p>
          <p>{`${t("today")} ${currentDate}`}</p>
        </div>
      </div>
    </footer>
  );
}
