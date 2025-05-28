import { UnitValue } from "@/lib/measurements";
import { Ingredient } from "@/types/recipe";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IngredientPreviewProps {
  ingredient: Ingredient;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  getUnitLabel: (value: string | UnitValue) => string;
  className?: string;
}

const IngredientPreview: React.FC<IngredientPreviewProps> = ({
  ingredient,
  index,
  onEdit,
  onDelete,
  getUnitLabel,
  className,
}) => {
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

  return (
    <div
      ref={itemRef}
      className={cn(
        `flex items-center justify-between cursor-pointer p-3`,
        className
      )}
      onClick={handleEdit}
      tabIndex={0}
      aria-label={`Ingredient: ${ingredient.name || "New Ingredient"}`}
    >
      <div className="flex-1">
        <div className="font-medium">{ingredient.name || "New Ingredient"}</div>
        <div className="text-sm text-muted-foreground">
          {displayAmount} {getUnitLabel(ingredient.unit)}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDelete}
          title={`Delete ${ingredient.name || "New Ingredient"}`}
          aria-label={`Delete ${ingredient.name || "New Ingredient"}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default IngredientPreview;
