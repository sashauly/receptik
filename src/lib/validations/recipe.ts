import * as z from "zod";

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
  prepTime: z.string().refine((value) => value.trim().length >= 1, {
    message: "prepTime is required and cannot contain only whitespace",
  }),
  cookTime: z.string().refine((value) => value.trim().length >= 1, {
    message: "cookTime is required and cannot contain only whitespace",
  }),
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
