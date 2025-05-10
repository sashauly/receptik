import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Recipe } from "@/types/recipe";
import { getUniqueSlug } from "@/lib/utils";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/lib/schema";
import { useRecipes } from "@/hooks/useRecipes";
import { useTranslation } from "react-i18next";
import BasicInfoFields from "./recipe-form/BasicInfoFields";
import { toast } from "sonner";
import KeywordsField from "./recipe-form/KeywordFields";
import IngredientFields from "./recipe-form/IngredientFields";
import { useEffect } from "react";
import InstructionFields from "./recipe-form/InstructionFields";
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
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function RecipeForm({
  initialRecipe,
  isOpen,
  onClose,
  onSave,
}: RecipeFormModalProps) {
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
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialRecipe ? t("forms.editRecipe") : t("forms.createRecipe")}
          </DialogTitle>
          <DialogDescription>
            {initialRecipe
              ? t("forms.editRecipeDescription")
              : t("forms.createRecipeDescription")}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicInfoFields />

            <KeywordsField />

            <IngredientFields />

            <InstructionFields />

            <DialogFooter className="flex gap-2">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                {t("forms.saveRecipe")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              {/* <DevTool control={form.control} /> */}
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
