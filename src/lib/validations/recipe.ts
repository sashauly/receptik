import * as z from "zod";

// TODO add russian translations
export const recipeFormSchema = z.object({
  title: z.string().refine((value) => value.trim().length >= 1, {
    message: "Title is required and cannot contain only whitespace",
  }),
  ingredients: z
    .array(z.string())
    .transform((ingredients) => ingredients.filter((i) => i.trim() !== ""))
    .refine((ingredients) => ingredients.length > 0, {
      message: "At least one ingredient is required",
    }),
  instructions: z
    .array(z.string())
    .transform((instructions) => instructions.filter((i) => i.trim() !== ""))
    .refine((instructions) => instructions.length > 0, {
      message: "At least one instruction is required",
    }),
  prepTime: z.coerce.number().min(1, "Preparation time must be at least 1"),
  cookTime: z.coerce.number().min(1, "Cooking time must be at least 1"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  image: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().startsWith("/", "Please enter a valid URL")),
  tags: z.array(
    z.string().refine((value) => value.trim().length >= 1, {
      message: "tags is required and cannot contain only whitespace",
    })
  ),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
