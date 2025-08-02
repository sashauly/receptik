import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Ingredient } from "@/types/recipe";
import { UnitValue } from "@/utils/measurements";
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface IngredientPreviewProps {
  ingredient: Ingredient;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  getUnitLabel: (value: string | UnitValue) => string;
  className?: string;
}

export default function IngredientPreview({
  ingredient,
  index,
  onEdit,
  onDelete,
  getUnitLabel,
  className,
}: IngredientPreviewProps) {
  const { t } = useTranslation();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleEdit = () => {
    onEdit(index);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(index);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement === itemRef.current) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleEdit();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEdit, index]);

  if (!ingredient) {
    return null;
  }

  const displayAmount =
    ingredient.amount !== null && ingredient.amount !== undefined
      ? ingredient.amount
      : "";

  const unitLabel = getUnitLabel(ingredient.unit);
  const displayText = displayAmount
    ? `${displayAmount} ${unitLabel}`
    : unitLabel;

  return (
    <div
      ref={itemRef}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg cursor-pointer",
        className,
      )}
      onClick={handleEdit}
      tabIndex={0}
      role="button"
      aria-label={`Edit ingredient: ${ingredient.name || "New Ingredient"}`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {ingredient.name || "New Ingredient"}
        </div>
        <div className="text-sm truncate">{displayText}</div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="h-8 w-8"
          title={t("common.edit")}
          aria-label={t("common.edit")}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8"
          title={t("common.delete")}
          aria-label={t("common.delete")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
