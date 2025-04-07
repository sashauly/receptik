import * as z from "zod"

export const recipeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ingredients: z.array(z.string().min(1, "Ingredient cannot be empty")).min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string().min(1, "Instruction cannot be empty"))
    .min(1, "At least one instruction is required"),
  prepTime: z.string().min(1, "Prep time is required"),
  cookTime: z.string().min(1, "Cook time is required"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  image: z.string().url("Please enter a valid URL").or(z.string().startsWith("/", "Please enter a valid URL")),
  tags: z.array(z.string()).default([]),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>

