import { Button } from "@/components/ui/button";
import { useRecipes } from "@/hooks/useRecipes";
import { recipeFormSchema, type RecipeFormValues } from "@/lib/schema";
import { getUniqueSlug } from "@/lib/utils";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import BasicInfoFields from "./recipe-form/BasicInfoFields";
import IngredientFields from "./recipe-form/IngredientFields";
import InstructionFields from "./recipe-form/InstructionFields";
import KeywordsField from "./recipe-form/KeywordFields";
// import { DevTool } from "@hookform/devtools";

const emptyRecipe = (): RecipeFormValues => ({
  name: "",
  prepTime: 1,
  cookTime: 1,
  servings: 1,
  keywords: [],
  ingredients: [""],
  instructions: [""],
});

interface RecipeFormModalProps {
  initialRecipe: Recipe | null;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormModalProps> = ({
  initialRecipe,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { recipes } = useRecipes();

  const recipe = initialRecipe || emptyRecipe();

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

  // TODO check to make sure we're not duplicate code for slugs
  const onSubmit = (values: RecipeFormValues) => {
    try {
      const filteredIngredients = values.ingredients.filter(
        (i) => i.trim() !== ""
      );
      const filteredInstructions = values.instructions.filter(
        (i) => i.trim() !== ""
      );

      const otherRecipes = initialRecipe
        ? recipes.filter((r) => r.id !== initialRecipe.id)
        : recipes;

      const existingSlugs = otherRecipes.map((r) => r.slug);

      const slug =
        initialRecipe && initialRecipe.name === values.name
          ? initialRecipe.slug
          : getUniqueSlug(values.name, existingSlugs);

      const newRecipe: Recipe = {
        ...values,
        id: initialRecipe?.id || uuidv4(),
        slug,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        dateCreated: initialRecipe?.dateCreated || new Date().toISOString(),
        dateModified: new Date().toISOString(),
      };

      onSave(newRecipe);
    } catch (error) {
      logError("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFields />

        <KeywordsField />

        <IngredientFields />

        <InstructionFields />

        <div className="flex gap-2">
          <Button type="submit">{t("forms.saveRecipe")}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          {/* <DevTool control={form.control} /> */}
        </div>
      </form>
    </FormProvider>
  );
};

export default RecipeForm;
