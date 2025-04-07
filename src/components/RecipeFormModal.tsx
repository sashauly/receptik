import { useState, useRef, useEffect } from "react";
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
  const [tagInput, setTagInput] = useState("");

  // Refs for auto-focusing
  const newIngredientRef = useRef<HTMLInputElement | null>(null);
  const newInstructionRef = useRef<HTMLTextAreaElement | null>(null);

  // Initialize form with default values or existing recipe
  const form = useForm<RecipeFormValues>({
    // @ts-expect-error - The recipeFormSchema is not exported
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: recipe?.title || "",
      ingredients: recipe?.ingredients || [""],
      instructions: recipe?.instructions || [""],
      prepTime: recipe?.prepTime || "",
      cookTime: recipe?.cookTime || "",
      servings: recipe?.servings || 1,
      image:
        recipe?.image ||
        "/recipe-management-pwa/placeholder.svg?height=300&width=400",
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
          recipe?.image ||
          "/recipe-management-pwa/placeholder.svg?height=300&width=400",
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
    // Filter out empty ingredients and instructions
    const filteredIngredients = data.ingredients.filter((i) => i.trim() !== "");
    const filteredInstructions = data.instructions.filter(
      (i) => i.trim() !== ""
    );

    // Get all existing recipes to check for slug uniqueness
    const savedRecipes = localStorage.getItem("recipes");
    const existingRecipes: Recipe[] = savedRecipes
      ? JSON.parse(savedRecipes)
      : [];

    // If we're editing, filter out the current recipe from the list
    const otherRecipes = recipe
      ? existingRecipes.filter((r) => r.id !== recipe.id)
      : existingRecipes;

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
            {recipe ? "Edit Recipe" : "Create New Recipe"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          {/* @ts-expect-error - The recipeFormSchema is not exported */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              // @ts-expect-error - The recipeFormSchema is not exported
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                // @ts-expect-error - The recipeFormSchema is not exported
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 15 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-expect-error - The recipeFormSchema is not exported
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cook Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 30 minutes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                // @ts-expect-error - The recipeFormSchema is not exported
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servings</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 4"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              // @ts-expect-error - The recipeFormSchema is not exported
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // @ts-expect-error - The recipeFormSchema is not exported
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
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
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag (e.g. Vegetarian, Dessert)"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Ingredients</FormLabel>
              <div className="space-y-2 mt-2">
                {form.watch("ingredients").map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [
                          ...form.getValues("ingredients"),
                        ];
                        newIngredients[index] = e.target.value;
                        form.setValue("ingredients", newIngredients);
                      }}
                      placeholder={`Ingredient ${index + 1}`}
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
                  Add Ingredient
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>Instructions</FormLabel>
              <div className="space-y-2 mt-2">
                {form.watch("instructions").map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [
                          ...form.getValues("instructions"),
                        ];
                        newInstructions[index] = e.target.value;
                        form.setValue("instructions", newInstructions);
                      }}
                      placeholder={`Step ${index + 1}`}
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
                  Add Step
                </Button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                Save Recipe
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
