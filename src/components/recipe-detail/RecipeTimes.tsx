import { formatDuration } from "@/lib/utils/time";
import { useTranslation } from "react-i18next";

interface RecipeTimesProps {
  cookTime: string;
  prepTime?: string;
  totalTime: string;
}

export default function RecipeTimes({
  cookTime,
  prepTime,
  totalTime,
}: RecipeTimesProps) {
  const { t } = useTranslation();
  const cookTimeString = formatDuration(prepTime || "PT0S", t);
  const prepTimeString = formatDuration(cookTime, t);
  const totalTimeString = formatDuration(totalTime, t);

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
      <div className="flex flex-col min-w-[60px]">
        <span>{t("recipe.cookTime")}</span>
        <span className="font-medium">
          <meta itemProp="cookTime" content={cookTime} />
          {cookTimeString}
        </span>
      </div>
      <div className="flex flex-col min-w-[60px]">
        <span>{t("recipe.prepTime")}</span>
        <span className="font-medium">
          <meta itemProp="prepTime" content={prepTime} />
          {prepTimeString}
        </span>
      </div>
      <div className="flex flex-col min-w-[60px]">
        <span>{t("recipe.totalTime")}</span>
        <span className="font-medium">
          <meta itemProp="totalTime" content={totalTime} />
          {totalTimeString}
        </span>
      </div>
    </div>
  );
}
