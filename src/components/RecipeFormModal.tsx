import { useState, useEffect, useRef } from "react";
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
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function RecipeFormModal({
  recipe,
  isOpen,
  onClose,
  onSave,
}: RecipeFormModalProps) {
  const { t } = useTranslation();
  const { recipes } = useRecipes();
  const [tagInput, setTagInput] = useState("");

  // Refs for auto-focusing
  const newIngredientRef = useRef<HTMLInputElement | null>(null);
  const newInstructionRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize form with default values or existing recipe
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: recipe?.title || "",
      ingredients: recipe?.ingredients || [""],
      instructions: recipe?.instructions || [""],
      prepTime: recipe?.prepTime || "",
      cookTime: recipe?.cookTime || "",
      servings: recipe?.servings || 1,
      image: recipe?.image || "/receptik/placeholder.svg?height=300&width=400",
      tags: recipe?.tags || [],
    },
  });

  // Reset form when opening/closing or changing recipe
  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: recipe?.title || "",
        ingredients: recipe?.ingredients?.length ? recipe.ingredients : [""],
        instructions: recipe?.instructions?.length ? recipe.instructions : [""],
        prepTime: recipe?.prepTime || "",
        cookTime: recipe?.cookTime || "",
        servings: recipe?.servings || 1,
        image:
          recipe?.image || "/receptik/placeholder.svg?height=300&width=400",
        tags: recipe?.tags || [],
      });
    }
  }, [isOpen, recipe, form]);

  const handleAddIngredient = () => {
    const currentIngredients = form.getValues("ingredients");
    form.setValue("ingredients", [...currentIngredients, ""]);

    // Set a flag to focus the new ingredient input after render
    setTimeout(() => {
      if (newIngredientRef.current) {
        newIngredientRef.current.focus();
      }
    }, 0);
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

    // Set a flag to focus the new instruction textarea after render
    setTimeout(() => {
      if (newInstructionRef.current) {
        newInstructionRef.current.focus();
      }
    }, 0);
  };

  const handleRemoveInstruction = (index: number) => {
    const currentInstructions = form.getValues("instructions");
    if (currentInstructions.length > 1) {
      const newInstructions = [...currentInstructions];
      newInstructions.splice(index, 1);
      form.setValue("instructions", newInstructions);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  const onSubmit = (data: RecipeFormValues) => {
    // The Zod schema now filters empty strings, but keep this for extra safety
    const filteredIngredients = data.ingredients.filter((i) => i.trim() !== "");
    const filteredInstructions = data.instructions.filter(
      (i) => i.trim() !== ""
    );

    // If we're editing, filter out the current recipe from the list
    const otherRecipes = recipe
      ? recipes.filter((r) => r.id !== recipe.id)
      : recipes;

    // Get existing slugs
    const existingSlugs = otherRecipes.map((r) => r.slug);

    // Generate a unique slug or keep the existing one if title hasn't changed
    const slug =
      recipe && recipe.title === data.title
        ? recipe.slug
        : getUniqueSlug(data.title, existingSlugs);

    const newRecipe: Recipe = {
      id: recipe?.id || uuidv4(),
      title: data.title,
      slug,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      servings: data.servings,
      image: data.image,
      tags: data.tags,
      createdAt: recipe?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newRecipe);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {recipe ? t("forms.editRecipe") : t("forms.createRecipe")}
          </DialogTitle>
          <DialogDescription>
            {recipe
              ? t("forms.editRecipeDescription")
              : t("forms.createRecipeDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">
                    {t("forms.recipeTitle")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      type="text"
                      placeholder={t("forms.titlePlaceholder")}
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image">{t("forms.imageUrl")}</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="text"
                      placeholder={t("forms.imageUrlPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="tags">{t("forms.tags")}</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder={t("forms.tagsPlaceholder")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleAddTag}
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
                      ref={
                        index === form.watch("ingredients").length - 1
                          ? newIngredientRef
                          : null
                      }
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
                      ref={
                        index === form.watch("instructions").length - 1
                          ? newInstructionRef
                          : null
                      }
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
