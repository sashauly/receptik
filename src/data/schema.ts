import { logError } from "@/lib/utils/logger";
import { TFunction } from "i18next";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

const isValidISO8601Duration = (value: string) => {
  try {
    Temporal.Duration.from(value);
    return true;
  } catch (error) {
    logError("Invalid ISO8601 duration:", error);
    return false;
  }
};

const isTimeEmpty = (val: string) => {
  try {
    const duration = Temporal.Duration.from(val || "PT0S");
    return duration.hours !== 0 || duration.minutes !== 0;
  } catch (error) {
    logError("Time is zero:", error);
    return false;
  }
};

export const createRecipeFormSchema = (
  t: TFunction<"translation", undefined>
) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: t("validation.nameTooShort") })
      .max(50, { message: t("validation.nameTooLong") }),
    description: z
      .string()
      .trim()
      .max(500, { message: "Description must not exceed 500 characters." })
      .optional(),
    prepTime: z
      .string()
      .refine(isValidISO8601Duration, {
        message: t("validation.prepTimeInvalid"),
      })
      .optional(),
    cookTime: z
      .string()
      .refine((val) => isTimeEmpty(val), {
        message: t("validation.cookTimeEmpty"),
      })
      .refine(isValidISO8601Duration, {
        message: t("validation.cookTimeInvalid"),
      }),
    servings: z.coerce
      .number()
      .min(1, { message: t("validation.servingsTooFew") })
      .max(100, { message: t("validation.servingsTooMany") }),
    keywords: z.array(z.string().trim()).default([]).optional(),
    ingredients: z
      .array(
        z
          .object({
            name: z.string().trim().min(1, "Ingredient name is required"),
            amount: z
              .number()
              .min(0, "Amount must be a positive number")
              .nullable(),
            unit: z.string(),
          })
          .refine(
            (ingredient) => {
              if (
                ingredient.unit === "toTaste" ||
                ingredient.unit === "optional"
              ) {
                return (
                  ingredient.amount === null ||
                  (typeof ingredient.amount === "number" &&
                    ingredient.amount >= 0)
                );
              } else {
                return (
                  typeof ingredient.amount === "number" &&
                  ingredient.amount >= 0
                );
              }
            },
            {
              message:
                "Amount is required and must be a positive number for this unit.",
              path: ["amount"],
            }
          )
      )
      .refine((ingredients) => ingredients.length > 0, {
        message: "At least one ingredient is required",
      }),
    instructions: z
      .array(z.string().trim().min(1, "Instruction step cannot be empty"))
      .min(1, "At least one instruction step is required"),
  });

export type RecipeFormValues = z.infer<
  ReturnType<typeof createRecipeFormSchema>
>;
