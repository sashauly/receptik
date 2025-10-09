import { Button } from "@/components/ui/button";
import { createRecipeFormSchema, RecipeFormValues } from "@/data/schema";
import type { Recipe } from "@/types/recipe";
import { logError } from "@/utils/logger";
import { calculateTotalTime } from "@/utils/time";
// import { DevTool } from "@hookform/devtools";
import BasicInfoFields from "@/components/recipe-form/BasicInfoFields";
import ImageUploadField from "@/components/recipe-form/ImageUploadField";
import IngredientFields from "@/components/recipe-form/IngredientFields";
import InstructionFields from "@/components/recipe-form/InstructionFields";
import KeywordsField from "@/components/recipe-form/KeywordFields";
import ServingsField from "@/components/recipe-form/ServingsField";
import TimeFields from "@/components/recipe-form/TimeFields";
import { FormSchemaProvider } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type EmptyIngredient = RecipeFormValues["ingredients"][number];

const emptyRecipe = (): RecipeFormValues => ({
  name: "",
  servings: 4,
  prepTime: "PT0S",
  cookTime: "PT0S",
  keywords: [],
  images: [],
  ingredients: [
    { id: uuidv4(), name: "", amount: null, unit: "piece" } as EmptyIngredient,
  ],
  instructions: [""],
  author: "",
});

interface RecipeFormModalProps {
  initialRecipe: Recipe | null;
  onSave: (recipeData: RecipeFormValues & Recipe) => void;
  onCancel: () => void;
}

export default function RecipeForm({
  initialRecipe,
  onSave,
  onCancel,
}: RecipeFormModalProps) {
  const { t } = useTranslation();

  const recipe = (initialRecipe || emptyRecipe()) as RecipeFormValues;
  const recipeFormSchema = createRecipeFormSchema(t);

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema) as Resolver<RecipeFormValues>,
    defaultValues: recipe,
  });

  useEffect(() => {
    if (initialRecipe) {
      form.reset(recipe as RecipeFormValues);
    } else {
      form.reset(emptyRecipe());
    }
  }, [initialRecipe, form]); // eslint-disable-line react-hooks/exhaustive-deps

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
}
