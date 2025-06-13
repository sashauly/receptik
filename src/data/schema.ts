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
      .max(500, { message: t("validation.descriptionTooLong") })
      .optional(),
    author: z
      .string()
      .trim()
      .min(1, { message: t("validation.authorTooShort") })
      .max(50, { message: t("validation.authorTooLong") }),
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
            name: z
              .string()
              .trim()
              .min(1, t("validation.ingredientNameRequired")),
            amount: z
              .number()
              .min(0, t("validation.ingredientAmountRequired"))
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
              message: t("validation.ingredientAmountRequired"),
              path: ["amount"],
            }
          )
      )
      .refine((ingredients) => ingredients.length > 0, {
        message: t("validation.ingredientRequired"),
      }),
    instructions: z
      .array(z.string().trim().min(1, t("validation.instructionStepRequired")))
      .min(1, t("validation.instructionRequired")),
  });

export type RecipeFormValues = z.infer<
  ReturnType<typeof createRecipeFormSchema>
>;
