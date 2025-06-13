import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RecipeFormValues } from "@/data/schema";
import {
  getAllUnitsWithTranslatedLabels,
  getUnitsBySystem,
  getUnitsByType,
  Unit,
  UnitValue,
} from "@/lib/measurements";
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import IngredientItem from "./IngredientItem";
import { v4 as uuidv4 } from "uuid";

const IngredientFields: React.FC = () => {
  const { t } = useTranslation();
  const { control } = useFormContext<RecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const getUnitOptions = () => {
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
    return [...otherUnitOptions, ...metricUnitOptions];
  };
  const unitOptions = getUnitOptions();

  const getUnitLabel = (value: string | UnitValue): string => {
    const unit = unitOptions.find((opt) => opt.value === value);
    return unit ? unit.label : value.toString();
  };

  const isAmountRequired = (unit: string | UnitValue): boolean => {
    return unit !== "toTaste" && unit !== "optional";
  };

  const addIngredient = async () => {
    append({ id: uuidv4(), name: "", amount: null, unit: "piece" });
  };

  return (
    <FormField
      control={control}
      name="ingredients"
      render={() => (
        <FormItem>
          <FormLabel htmlFor="ingredients">{t("forms.ingredients")}</FormLabel>
          <input id="ingredients" hidden />
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <IngredientItem
                key={field.id}
                index={index}
                fieldId={field.id}
                remove={remove}
                getUnitLabel={getUnitLabel}
                unitOptions={unitOptions}
                isAmountRequired={isAmountRequired}
              />
            ))}

            <Button type="button" variant="outline" onClick={addIngredient}>
              <Plus />
              {t("forms.addIngredient")}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IngredientFields;
