import { RecipeFormValues } from "@/lib/schema";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { Label } from "../ui/label";

const IngredientFields = () => {
  const { t } = useTranslation();
  const {
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const ingredients = watch("ingredients");

  const handleAddIngredient = () => {
    const currentIngredients = getValues("ingredients");
    setValue("ingredients", [...currentIngredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setValue("ingredients", newIngredients);
    }
  };

  return (
    <>
      <Label
        className={`text-sm font-medium text-inherit m-0 p-0 ${errors.ingredients ? "text-destructive" : ""}`}
      >
        {t("forms.ingredients")}
      </Label>{" "}
      <div className="space-y-2 mt-2">
        {ingredients.map((_, index) => (
          <FormField
            key={index}
            control={control}
            name={`ingredients.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("forms.ingredientPlaceholder", {
                        index: index + 1,
                      })}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <X />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddIngredient}
          className="mt-2"
        >
          <Plus />
          {t("forms.addIngredient")}
        </Button>
      </div>
    </>
  );
};

export default IngredientFields;
