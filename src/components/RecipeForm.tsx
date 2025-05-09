import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, X } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { getUniqueSlug } from "@/lib/utils";
import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/lib/validations/recipe";
import { useRecipes } from "@/hooks/useRecipes";
import { useTranslation } from "react-i18next";

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
  const [keywordInput, setKeywordInput] = useState("");

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: initialRecipe?.name || "",
      ingredients: initialRecipe?.ingredients || [""],
      instructions: initialRecipe?.instructions || [""],
      prepTime: initialRecipe?.prepTime || 1,
      cookTime: initialRecipe?.cookTime || 1,
      servings: initialRecipe?.servings || 1,
      keywords: initialRecipe?.keywords || [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialRecipe?.name || "",
        ingredients: initialRecipe?.ingredients?.length
          ? initialRecipe.ingredients
          : [""],
        instructions: initialRecipe?.instructions?.length
          ? initialRecipe.instructions
          : [""],
        prepTime: initialRecipe?.prepTime || 1,
        cookTime: initialRecipe?.cookTime || 1,
        servings: initialRecipe?.servings || 1,
        keywords: initialRecipe?.keywords || [],
      });
    }
  }, [isOpen, initialRecipe, form]);

  const handleAddIngredient = () => {
    const currentIngredients = form.getValues("ingredients");
    form.setValue("ingredients", [...currentIngredients, ""]);
  };

  const handleRemoveIngredient = (index: number) => {
    const currentIngredients = form.getValues("ingredients");
    if (currentIngredients.length > 1) {
      const newIngredients = [...currentIngredients];
      newIngredients.splice(index, 1);
      form.setValue("ingredients", newIngredients);
    }
  };

  const handleAddInstruction = () => {
    const currentInstructions = form.getValues("instructions");
    form.setValue("instructions", [...currentInstructions, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    const currentInstructions = form.getValues("instructions");
    if (currentInstructions.length > 1) {
      const newInstructions = [...currentInstructions];
      newInstructions.splice(index, 1);
      form.setValue("instructions", newInstructions);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const currentKeywords = form.getValues("keywords");
      if (!currentKeywords.includes(keywordInput.trim())) {
        form.setValue("keywords", [...currentKeywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const currentKeywords = form.getValues("keywords");
    form.setValue(
      "keywords",
      currentKeywords.filter((k) => k !== keyword)
    );
  };

  // TODO check to make sure we're not duplicate code for slugs
  const onSubmit = (values: RecipeFormValues) => {
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
      id: initialRecipe?.id || uuidv4(),
      name: values.name,
      slug,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prepTime: values.prepTime,
      cookTime: values.cookTime,
      servings: values.servings,
      keywords: values.keywords,
      dateCreated: initialRecipe?.dateCreated || new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };

    onSave(newRecipe);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">{t("forms.recipeName")}</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t("forms.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prepTime">
                      {t("forms.prepTime")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="prepTime"
                        placeholder={t("forms.prepTimePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cookTime">
                      {t("forms.cookTime")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="cookTime"
                        placeholder={t("forms.cookTimePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="servings">
                      {t("forms.servings")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        id="servings"
                        min="1"
                        placeholder={t("forms.servingsPlaceholder")}
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="keywords">
                    {t("forms.keywords")}
                  </FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((keyword) => (
                      <div
                        key={keyword}
                        className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm"
                      >
                        {keyword}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveKeyword(keyword)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder={t("forms.keywordsPlaceholder")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();

                          handleAddKeyword();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleAddKeyword}
                      variant="outline"
                    >
                      <Plus />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <div>
              <FormLabel htmlFor="ingredient-0">
                {t("forms.ingredients")}
              </FormLabel>
              <div className="space-y-2 mt-2">
                {form.watch("ingredients").map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      id={`ingredient-${index}`}
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [
                          ...form.getValues("ingredients"),
                        ];
                        newIngredients[index] = e.target.value;
                        form.setValue("ingredients", newIngredients);
                      }}
                      placeholder={t("forms.ingredientPlaceholder", {
                        index: index + 1,
                      })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={form.watch("ingredients").length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.formState.errors.ingredients && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.ingredients.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("forms.addIngredient")}
                </Button>
              </div>
            </div>

            <div>
              <FormLabel htmlFor="instruction-0">
                {t("forms.instructions")}
              </FormLabel>
              <div className="space-y-2 mt-2">
                {form.watch("instructions").map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      id={`instruction-${index}`}
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [
                          ...form.getValues("instructions"),
                        ];
                        newInstructions[index] = e.target.value;
                        form.setValue("instructions", newInstructions);
                      }}
                      placeholder={t("forms.stepPlaceholder", {
                        index: index + 1,
                      })}
                      className="min-h-[80px]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveInstruction(index)}
                      disabled={form.watch("instructions").length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {form.formState.errors.instructions && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.instructions.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddInstruction}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("forms.addStep")}
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                {t("forms.saveRecipe")}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
