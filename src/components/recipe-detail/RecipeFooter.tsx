import { Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";

interface RecipeFooterProps {
  updatedAt: Date;
  author?: string;
}

const RecipeFooter: React.FC<RecipeFooterProps> = ({ updatedAt, author }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  return (
    <div className="flex items-center gap-4">
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
};

export default RecipeFooter;
