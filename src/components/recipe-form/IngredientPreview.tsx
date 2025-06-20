import { UnitValue } from "@/lib/measurements";
import { Ingredient } from "@/types/recipe";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface IngredientPreviewProps {
  ingredient: Ingredient;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  getUnitLabel: (value: string | UnitValue) => string;
  className?: string;
}

function IngredientPreview({
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
        "group flex items-center justify-between p-4 hover:bg-accent/50 transition-colors rounded-lg cursor-pointer",
        className
      )}
      onClick={handleEdit}
      tabIndex={0}
      role="button"
      aria-label={`Edit ingredient: ${ingredient.name || "New Ingredient"}`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate group-hover:text-primary transition-colors">
          {ingredient.name || "New Ingredient"}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {displayText}
        </div>
      </div>
      <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
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

export default IngredientPreview;
