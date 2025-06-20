import { Minus, Plus } from "lucide-react";
import { useCallback } from "react";
import { Button } from "../ui/button";

const SERVINGS_STEP = 1;
const SERVINGS_MIN = 1;

interface RecipeServingsProps {
  servings: number;
  onServingsChange: (change: number) => void;
}

function RecipeServings({ servings, onServingsChange }: RecipeServingsProps) {
  const incrementServings = useCallback(() => {
    onServingsChange(SERVINGS_STEP);
  }, [onServingsChange]);

  const decrementServings = useCallback(() => {
    onServingsChange(-SERVINGS_STEP);
  }, [onServingsChange]);

  return (
    <div className="flex items-center">
      <div className="flex items-center justify-center" itemProp="recipeYield">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-r-none"
          onClick={decrementServings}
          disabled={servings <= SERVINGS_MIN}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="inline-flex items-center justify-center border size-9 text-center">
          {servings}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-l-none"
          onClick={incrementServings}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default RecipeServings;
