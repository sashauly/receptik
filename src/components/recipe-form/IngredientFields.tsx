import { RecipeFormValues } from "@/data/schema";
import { Plus, X } from "lucide-react";
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
} from "@/lib/measurements";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const IngredientFields = () => {
  const { t } = useTranslation();

  const { control, watch } = useFormContext<RecipeFormValues>();

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
  // TODO this is a placeholder only for metric
  const unitOptions = [...otherUnitOptions, ...metricUnitOptions];

  const addIngredient = () => {
    append({ name: "", amount: 0, unit: "piece" });
  };

  const removeIngredient = (index: number) => {
    if (fields.length <= 1) {
      return;
    }
    remove(index);
  };

  const isAmountRequired = (unit: string): boolean => {
    return unit !== "toTaste" && unit !== "optional";
  };

  return (
    <>
      <Label className="text-sm font-medium text-inherit m-0 p-0">
        {t("forms.ingredients")}
      </Label>
      <div className="space-y-4 mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        placeholder={t("forms.ingredientAmount")}
                        disabled={
                          !isAmountRequired(watchIngredients[index].unit)
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

            <div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeIngredient(index)}
                disabled={fields.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addIngredient}>
          <Plus />
          {t("forms.addIngredient")}
        </Button>
      </div>
    </>
  );
};

export default IngredientFields;
