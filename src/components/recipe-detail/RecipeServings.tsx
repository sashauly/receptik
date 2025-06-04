import { Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface RecipeServingsProps {
  servings: number;
}

const RecipeServings: React.FC<RecipeServingsProps> = ({ servings }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center">
      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
      <p className="text-muted-foreground">
        {servings}{" "}
        {t("recipe.servings_interval", {
          postProcess: "interval",
          count: Number(servings),
        })}
      </p>
    </div>
  );
};

export default RecipeServings;
