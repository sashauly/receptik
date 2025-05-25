import { RecipeFormValues } from "@/data/schema";
import { Plus, Trash2, X, Check } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { FormControl, FormField, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  getAllUnitsWithTranslatedLabels,
  getUnitsBySystem,
  getUnitsByType,
  Unit,
  UnitValue,
} from "@/lib/measurements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Ingredient } from "@/types/recipe";
import { useState, useEffect, useRef } from "react";

const IngredientPreview = ({
  ingredient,
  index,
  onEdit,
  onDelete,
  isDeleteDisabled,
  getUnitLabel,
}: {
  ingredient: Ingredient;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  isDeleteDisabled: boolean;
  getUnitLabel: (value: string | UnitValue) => string;
}) => {
  const displayAmount =
    ingredient.amount !== null && ingredient.amount !== undefined
      ? ingredient.amount
      : "";

  return (
    <div
      className="flex items-center justify-between cursor-pointer"
      onClick={() => onEdit(index)}
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete(index);
          }}
          disabled={isDeleteDisabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const IngredientFields = () => {
  const { t } = useTranslation();

  const { control, watch, trigger, getValues, setValue } =
    useFormContext<RecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const watchIngredients = watch("ingredients");

  const allUnitsWithLabels = getAllUnitsWithTranslatedLabels(t);
  const metricSystem = getUnitsBySystem(
    allUnitsWithLabels as unknown as Unit[],
    "metric"
  );
  const otherUnits = getUnitsByType(allUnitsWithLabels, "other");

  const metricUnitOptions = metricSystem.map((unit) => ({
    value: unit.value,
    label: unit.label,
  }));
  const otherUnitOptions = otherUnits.map((unit) => ({
    value: unit.value,
    label: unit.label,
  }));
  const unitOptions = [...otherUnitOptions, ...metricUnitOptions];

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const originalIngredient = useRef<Ingredient | null>(null);

  useEffect(() => {
    if (fields.length > 0 && editingIndex === null) {
      setEditingIndex(0);

      originalIngredient.current = getValues(`ingredients.${0}`);
    }
  }, [fields.length, getValues]);

  const getUnitLabel = (value: string | UnitValue): string => {
    const unit = unitOptions.find((opt) => opt.value === value);
    return unit ? unit.label : value.toString();
  };

  const addIngredient = () => {
    if (editingIndex !== null) {
      const currentIngredient = getValues(`ingredients.${editingIndex}`);

      if (
        !currentIngredient.name ||
        (isAmountRequired(currentIngredient.unit) &&
          (currentIngredient.amount === null ||
            currentIngredient.amount === undefined))
      ) {
        trigger([
          `ingredients.${editingIndex}.name`,
          `ingredients.${editingIndex}.amount`,
        ]);
        return;
      }
    }

    append({ name: "", amount: 0, unit: "piece" });

    setEditingIndex(fields.length);

    originalIngredient.current = { name: "", amount: 0, unit: "piece" };
  };

  const removeIngredient = (index: number) => {
    if (fields.length <= 1) {
      return;
    }
    remove(index);

    if (editingIndex === index) {
      setEditingIndex(null);
      originalIngredient.current = null;
    }

    if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const isAmountRequired = (unit: string | UnitValue): boolean => {
    return unit !== "toTaste" && unit !== "optional";
  };

  const handleSaveEdit = async (index: number) => {
    const isValid = await trigger([
      `ingredients.${index}.name`,
      `ingredients.${index}.amount`,
      `ingredients.${index}.unit`,
    ]);

    if (isValid) {
      setEditingIndex(null);
      originalIngredient.current = null;
    }
  };

  const handleCancelEdit = (index: number) => {
    if (originalIngredient.current) {
      setValue(`ingredients.${index}`, originalIngredient.current);
    }
    setEditingIndex(null);
    originalIngredient.current = null;
  };

  const handleEditIngredient = (index: number) => {
    if (editingIndex !== null && editingIndex !== index) {
      handleSaveEdit(editingIndex);
    }
    setEditingIndex(index);

    originalIngredient.current = getValues(`ingredients.${index}`);
  };

  return (
    <>
      <Label className="text-sm font-medium text-inherit m-0 p-0">
        {t("forms.ingredients")}
      </Label>
      <div className="space-y-4 mt-2">
        {fields.map((field, index) => {
          const isEditing = editingIndex === index;
          const currentIngredient = watchIngredients[index];

          return (
            <div key={field.id} className="space-y-2 border rounded-lg p-3">
              {isEditing ? (
                <>
                  <FormField
                    control={control}
                    name={`ingredients.${index}.name`}
                    render={({ field }) => (
                      <>
                        <Label htmlFor={`ingredient-name-${index}`}>
                          {t("forms.ingredientName")}
                        </Label>
                        <FormControl>
                          <Input
                            id={`ingredient-name-${index}`}
                            placeholder={t("forms.ingredientNamePlaceholder")}
                            itemProp="recipeIngredient"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name={`ingredients.${index}.amount`}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor={`ingredient-amount-${index}`}>
                            {t("forms.ingredientAmount")}
                          </Label>
                          <FormControl>
                            <Input
                              id={`ingredient-amount-${index}`}
                              type="number"
                              step="any"
                              min="0"
                              {...field}
                              value={
                                field.value === null ||
                                field.value === undefined
                                  ? ""
                                  : field.value
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? null : parseFloat(value)
                                );
                              }}
                              placeholder={t("forms.ingredientAmount")}
                              disabled={
                                !isAmountRequired(currentIngredient?.unit)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Label htmlFor={`ingredient-unit-${index}`}>
                            {t("forms.ingredientUnit")}
                          </Label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                id={`ingredient-unit-${index}`}
                                className="w-full"
                              >
                                <SelectValue
                                  placeholder={t("forms.ingredientUnit")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitOptions.map((unit) => (
                                <SelectItem key={unit.value} value={unit.value}>
                                  {unit.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleSaveEdit(index)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleCancelEdit(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <IngredientPreview
                  ingredient={currentIngredient}
                  index={index}
                  onEdit={handleEditIngredient}
                  onDelete={removeIngredient}
                  isDeleteDisabled={fields.length <= 1}
                  getUnitLabel={getUnitLabel}
                />
              )}
            </div>
          );
        })}

        <Button type="button" variant="outline" onClick={addIngredient}>
          <Plus />
          {t("forms.addIngredient")}
        </Button>
      </div>
    </>
  );
};

export default IngredientFields;
