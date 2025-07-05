import { useState, useRef, useEffect, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { UnitValue } from "@/lib/measurements";
import IngredientPreview from "./IngredientPreview";
import { Ingredient } from "@/types/recipe";
import UnitSelectionPage from "./UnitSelectionPage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { v4 as uuidv4 } from "uuid";

interface IngredientItemProps {
  index: number;
  fieldId: string;
  remove: (index?: number | number[]) => void;
  getUnitLabel: (value: string | UnitValue) => string;
  unitOptions: { value: string | UnitValue; label: string }[];
  isAmountRequired: (unit: string | UnitValue) => boolean;
}

function IngredientItem({
  index,
  fieldId,
  remove,
  getUnitLabel,
  unitOptions,
  isAmountRequired,
}: IngredientItemProps) {
  const { t } = useTranslation();
  const { control, trigger, getValues, setValue, clearErrors } =
    useFormContext();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [isEditing, setIsEditing] = useState(false);
  const [showUnitSelection, setShowUnitSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const originalIngredientData = useRef<Ingredient | null>(null);

  const itemContainerRef = useRef<HTMLDivElement>(null);

  const watchedIngredient = useWatch({
    control,
    name: `ingredients.${index}`,
  });

  const handleStartEditing = () => {
    setIsEditing(true);
    const currentValues = getValues(`ingredients.${index}`);
    // Preserve the ID when editing
    originalIngredientData.current = {
      ...currentValues,
      id: currentValues.id || uuidv4(),
    };

    requestAnimationFrame(() => {
      const firstInput = itemContainerRef.current?.querySelector(
        `#ingredient-name-${fieldId}`
      ) as HTMLInputElement;
      firstInput?.focus();
    });
  };

  const handleSave = useCallback(async () => {
    const isValid = await trigger([
      `ingredients.${index}.name`,
      `ingredients.${index}.amount`,
      `ingredients.${index}.unit`,
    ]);

    if (isValid) {
      setIsEditing(false);
      originalIngredientData.current = null;

      requestAnimationFrame(() => {
        const previewElement = itemContainerRef.current?.querySelector(
          `.ingredient-preview-${fieldId}`
        ) as HTMLDivElement;
        previewElement?.focus();
      });
    }
  }, [fieldId, index, trigger]);

  const handleDelete = useCallback(() => {
    remove(index);
  }, [index, remove]);

  const handleCancel = useCallback(() => {
    if (originalIngredientData.current) {
      setValue(`ingredients.${index}`, originalIngredientData.current);
      clearErrors([
        `ingredients.${index}.name`,
        `ingredients.${index}.amount`,
        `ingredients.${index}.unit`,
      ]);
    } else {
      handleDelete();
    }
    setIsEditing(false);
    originalIngredientData.current = null;
  }, [clearErrors, handleDelete, index, setValue]);

  const handleUnitSelect = (value: string | UnitValue) => {
    setValue(`ingredients.${index}.unit`, value);
    if (!isAmountRequired(value)) {
      setValue(`ingredients.${index}.amount`, null);
    }
    setShowUnitSelection(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        isEditing &&
        itemContainerRef.current?.contains(document.activeElement) &&
        !(document.activeElement instanceof HTMLButtonElement)
      ) {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSave();
        } else if (event.key === "Escape") {
          handleCancel();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, handleSave, handleCancel]);

  if (!watchedIngredient) {
    return null;
  }

  if (showUnitSelection) {
    return (
      <UnitSelectionPage
        unitOptions={unitOptions}
        selectedUnit={watchedIngredient.unit}
        onSelect={handleUnitSelect}
        onBack={() => setShowUnitSelection(false)}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
    );
  }

  return (
    <div
      ref={itemContainerRef}
      className="space-y-2 bg-primary-foreground border rounded-lg"
      data-ingredient-index={index}
    >
      {isEditing ? (
        <div className="space-y-2 p-3">
          <FormField
            control={control}
            name={`ingredients.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`ingredient-name-${fieldId}`}>
                  {t("forms.ingredientName")}
                </FormLabel>
                <FormControl>
                  <Input
                    id={`ingredient-name-${fieldId}`}
                    type="text"
                    placeholder={t("forms.ingredientNamePlaceholder")}
                    aria-label={t("forms.ingredientName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`ingredients.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`ingredient-amount-${fieldId}`}>
                    {t("forms.ingredientAmount")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={`ingredient-amount-${fieldId}`}
                      type="number"
                      step="any"
                      min="0"
                      {...field}
                      value={
                        field.value === null || field.value === undefined
                          ? ""
                          : field.value
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : parseFloat(value));
                      }}
                      placeholder={t("forms.ingredientAmount")}
                      aria-label={t("forms.ingredientAmount")}
                      disabled={!isAmountRequired(watchedIngredient.unit)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.unit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`ingredient-unit-${fieldId}`}>
                    {t("forms.ingredientUnit")}
                  </FormLabel>
                  {isMobile ? (
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setShowUnitSelection(true)}
                    >
                      {getUnitLabel(field.value)}
                    </Button>
                  ) : (
                    <Select
                      name={`ingredients-${index}-unit`}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (!isAmountRequired(value)) {
                          setValue(`ingredients.${index}.amount`, null);
                        }
                      }}
                      aria-label={t("forms.ingredientUnit")}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          id={`ingredient-unit-${fieldId}`}
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
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
              onClick={handleSave}
              title={t("forms.saveIngredient")}
              aria-label={t("forms.saveIngredient")}
              disabled={!watchedIngredient.name}
            >
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
              onClick={handleCancel}
              title={t("forms.cancelIngredient")}
              aria-label={t("forms.cancelIngredient")}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-8 h-8 p-1 sm:w-10 sm:h-10 sm:p-2"
              onClick={handleDelete}
              title={t("forms.deleteIngredient")}
              aria-label={t("forms.deleteIngredient")}
            >
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <IngredientPreview
          className={`ingredient-preview-${fieldId}`}
          ingredient={watchedIngredient}
          index={index}
          onEdit={handleStartEditing}
          onDelete={handleDelete}
          getUnitLabel={getUnitLabel}
        />
      )}
    </div>
  );
}

export default IngredientItem;
