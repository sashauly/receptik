import { Button } from "@/components/ui/button";
import { createRecipeFormSchema, RecipeFormValues } from "@/data/schema";
import { logError } from "@/lib/utils/logger";
import { calculateTotalTime } from "@/lib/utils/time";
import type { Recipe } from "@/types/recipe";
// import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import BasicInfoFields from "./recipe-form/BasicInfoFields";
import IngredientFields from "./recipe-form/IngredientFields";
import InstructionFields from "./recipe-form/InstructionFields";
import KeywordsField from "./recipe-form/KeywordFields";
import ServingsField from "./recipe-form/ServingsField";
import TimeFields from "./recipe-form/TimeFields";
import { FormSchemaProvider } from "@/components/ui/form";
import { v4 as uuidv4 } from "uuid";
import ImageUploadField from "./recipe-form/ImageUploadField";

const emptyRecipe = (): RecipeFormValues => ({
  name: "",
  servings: 4,
  prepTime: "PT0S",
  cookTime: "PT0S",
  keywords: [],
  images: [],
  ingredients: [{ id: uuidv4(), name: "", amount: null, unit: "piece" }],
  instructions: [""],
  author: "",
});

interface RecipeFormModalProps {
  initialRecipe: Recipe | null;
  onSave: (recipeData: RecipeFormValues & Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormModalProps> = ({
  initialRecipe,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();

  const recipe = initialRecipe || emptyRecipe();
  const recipeFormSchema = createRecipeFormSchema(t);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe,
  });

  useEffect(() => {
    if (initialRecipe) {
      form.reset(
        (formValues) => ({
          ...formValues,
        }),
        { keepDefaultValues: true }
      );
    }
  }, [initialRecipe, form]);

  const onSubmit = (values: RecipeFormValues) => {
    try {
      const calculatedTotalTime = calculateTotalTime(
        values.prepTime || "PT0S",
        values.cookTime
      );

      const newRecipe: Recipe = {
        ...values,
        id: initialRecipe?.id || "",
        slug: initialRecipe?.slug || "",
        totalTime: calculatedTotalTime,
        createdAt: initialRecipe?.createdAt || new Date(),
        updatedAt: new Date(),
        images: values.images || [],
      };

      onSave(newRecipe);
    } catch (error) {
      logError("Form submission error", error);
      toast.error(t("forms.failedToSubmit"));
    }
  };

  return (
    <FormSchemaProvider schema={recipeFormSchema}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <ImageUploadField />

          <BasicInfoFields />

          <TimeFields />

          <KeywordsField />

          <ServingsField />

          <IngredientFields />

          <InstructionFields />

          <div className="flex gap-2">
            <Button type="submit">{t("forms.saveRecipe")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              {t("common.reset")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
            {/* <DevTool control={form.control} /> */}
          </div>
        </form>
      </FormProvider>
    </FormSchemaProvider>
  );
};

export default RecipeForm;
