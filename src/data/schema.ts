import { logError } from "@/lib/utils/logger";
import { t } from "i18next";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

export const timeSchema = z.object({
  hours: z.coerce.number().min(0, "Hours cannot be negative"),
  minutes: z.coerce.number().min(0, "Minutes cannot be negative").max(59),
});

const isValidISO8601Duration = (value: string) => {
  try {
    Temporal.Duration.from(value);
    return true;
  } catch (error) {
    logError("Invalid ISO8601 duration:", error);
    return false;
  }
};

// TODO add russian translations
export const recipeFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: t("validation.nameTooShort") })
    .max(50, { message: t("validation.nameTooLong") }),
  prepTime: z
    .string()
    .refine(isValidISO8601Duration, {
      message: t("validation.prepTimeInvalid"),
    })
    .optional(),
  cookTime: z.string().refine(isValidISO8601Duration, {
    message: t("validation.cookTimeInvalid"),
  }),
  servings: z
    .number()
    .int()
    .min(1, { message: t("validation.servingsTooFew") })
    .max(100, { message: t("validation.servingsTooMany") }),
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
