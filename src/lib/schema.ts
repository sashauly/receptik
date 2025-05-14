import { z } from "zod";

// TODO add russian translations
export const recipeFormSchema = z.object({
  name: z.string().refine((value) => value.trim().length >= 1, {
    message: "Name is required and cannot contain only whitespace",
  }),
  prepTime: z.number().min(0, "Prep time cannot be negative").optional(),
  cookTime: z.number().min(0, "Cook time cannot be negative"),
  servings: z.coerce.number().min(1, "Servings must be at least 1"),
  keywords: z.array(z.string()).default([]).optional(),
  ingredients: z
    .array(z.string().min(1, "Ingredient name cannot be empty"))
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string().min(1, "Instruction step cannot be empty"))
    .min(1, "At least one instruction step is required"),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

// const RecipeSchema = z.object({
//   name: z.string().min(1, "Recipe name is required"),
//   description: z.string().min(1, "Description is required"),
//   category: z.array(z.string()).default([]).optional(),
//   cuisine: z.array(z.string()).default([]).optional(),
//   ingredients: z
//     .array(
//       z.object({
//         name: z.string().min(1, "Ingredient name is required"),
//         amount: z.number().min(0, "Amount must be a positive number"),
//         unit: z.string(),
//       })
//     )
//     .refine((ingredients) => ingredients.length > 0, {
//       message: "At least one ingredient is required",
//     }),
//   instructions: z
//     .array(z.string().min(1, "Instruction step cannot be empty"))
//     .refine((instructions) => instructions.length > 0, {
//       message: "At least one instruction is required",
//     }),
//   // image: z.object({
//   //   name: z.string(),
//   //   data: z.string(),
//   // }),
//   servings: z.number().min(1, "Servings must be at least 1"),
//   prepTime: z.string().optional(),
//   cookTime: z.string(),
//   totalTime: z.string().optional(),
//   author: z.string().min(1, "Author is required"),
//   keywords: z
//     .array(
//       z.string().refine((value) => value.trim().length >= 1, {
//         message: "tags is required and cannot contain only whitespace",
//       })
//     )
//     .optional(),
// });

// type RecipeFormValues = z.infer<typeof RecipeSchema>;
