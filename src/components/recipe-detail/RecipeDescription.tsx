import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RecipeDescriptionProps {
  description: string;
}

export default function RecipeDescription({
  description,
}: RecipeDescriptionProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;

  const canExpand = description.length > 120;

  if (!canExpand) {
    return <div className="text-base">{description}</div>;
  }

  return (
    <div
      className="text-sm cursor-pointer select-none"
      onClick={() => setExpanded((v) => !v)}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <span className={expanded ? "" : "line-clamp-2"}>{description}</span>
      <button
        className="ml-2 text-primary underline text-xs"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((v) => !v);
        }}
      >
        {expanded ? t("common.showLess") : t("common.showMore")}
      </button>
    </div>
  );
}
