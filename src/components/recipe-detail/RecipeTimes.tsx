import { formatDuration } from "@/lib/utils/time";
import { Clock } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface RecipeTimesProps {
  cookTime: string;
  prepTime?: string;
  totalTime: string;
}

const RecipeTimes: React.FC<RecipeTimesProps> = ({
  cookTime,
  prepTime,
  totalTime,
}) => {
  const { t } = useTranslation();

  const cookTimeString = formatDuration(prepTime || "PT0S", t);
  const prepTimeString = formatDuration(cookTime, t);
  const totalTimeString = formatDuration(totalTime, t);

  return (
    <div className="grid grid-cols-3 gap-2">
      {prepTime && (
        <div className="bg-muted rounded-lg p-2">
          <h4 className="font-medium">{t("recipe.prepTime")}</h4>
          <p className="text-muted-foreground">
            <meta itemProp="prepTime" content={prepTime} />
            {prepTimeString}
          </p>
        </div>
      )}
      {cookTime && (
        <div className="bg-muted rounded-lg p-2">
          <h4 className="font-medium">{t("recipe.cookTime")}</h4>
          <p className="text-muted-foreground">
            <meta itemProp="cookTime" content={cookTime} />
            {cookTimeString}
          </p>
        </div>
      )}
      <div className="flex flex-col bg-muted rounded-lg p-2">
        <h4 className="font-medium">{t("recipe.totalTime")}</h4>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            <meta itemProp="totalTime" content={totalTime} />
            {totalTimeString}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeTimes;
