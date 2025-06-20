import { Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";

interface RecipeFooterProps {
  updatedAt: Date;
  author?: string;
}

function RecipeFooter({ updatedAt, author }: RecipeFooterProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-between gap-2 text-sm text-muted-foreground">
      {author && (
        <div className="flex items-center" itemProp="author">
          <User size={14} className="mr-1" />
          <span>{author}</span>
        </div>
      )}
      {updatedAt && (
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span itemProp="dateModified">
            {t("common.lastUpdated")}:{" "}
            {updatedAt.toLocaleString(settings.language)}
          </span>
        </div>
      )}
    </div>
  );
}

export default RecipeFooter;
