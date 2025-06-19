import React from "react";
import { AlertTriangle } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface RecipeDiffTableProps {
  existing: Recipe;
  imported: Recipe;
  invalidFields?: string[];
  invalidFieldErrors?: Record<string, string>;
}

interface DiffField {
  field: keyof Recipe;
  existingValue: string | number | undefined;
  importedValue: string | number | undefined;
  isDifferent: boolean;
  importedValueIsInvalid: boolean;
}

function isDate(val: unknown): val is Date {
  return Object.prototype.toString.call(val) === "[object Date]";
}

function hasName(obj: unknown): obj is { name: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    typeof (obj as { name: unknown }).name === "string"
  );
}

function diffRecipeFields(existing: Recipe, imported: Recipe): DiffField[] {
  const fields: Array<keyof Recipe> = [
    "name",
    "description",
    "author",
    "servings",
    "prepTime",
    "cookTime",
    "totalTime",
    "keywords",
    "ingredients",
    "instructions",
    "images",
  ];
  return fields.map((field) => {
    let existingValue: unknown = existing[field];
    let importedValue: unknown = imported[field];
    let importedValueIsInvalid = false;
    // For arrays/objects, show summary
    if (field === "keywords") {
      existingValue = Array.isArray(existingValue)
        ? (existingValue as unknown[]).join(", ")
        : existingValue;
      importedValue = Array.isArray(importedValue)
        ? (importedValue as unknown[]).join(", ")
        : importedValue;
    } else if (field === "ingredients") {
      existingValue = Array.isArray(existingValue)
        ? (existingValue as unknown[])
            .map((i) => (hasName(i) ? i.name : String(i)))
            .join(", ")
        : existingValue;
      if (Array.isArray(importedValue)) {
        if (importedValue.length > 0 && typeof importedValue[0] === "string") {
          // Invalid: array of strings
          importedValueIsInvalid = true;
          importedValue = (importedValue as unknown[]).join(", ");
        } else {
          importedValue = (importedValue as unknown[])
            .map((i) => (hasName(i) ? i.name : String(i)))
            .join(", ");
        }
      }
    } else if (field === "instructions") {
      existingValue = Array.isArray(existingValue)
        ? (existingValue as string[]).join(" | ")
        : existingValue;
      importedValue = Array.isArray(importedValue)
        ? (importedValue as string[]).join(" | ")
        : importedValue;
    } else if (field === "images") {
      existingValue = Array.isArray(existingValue)
        ? `${(existingValue as unknown[]).length} image(s)`
        : existingValue;
      importedValue = Array.isArray(importedValue)
        ? `${(importedValue as unknown[]).length} image(s)`
        : importedValue;
    } else if (isDate(existingValue)) {
      existingValue = existingValue.toISOString();
    } else if (isDate(importedValue)) {
      importedValue = importedValue.toISOString();
    }
    const isDifferent =
      JSON.stringify(existingValue) !== JSON.stringify(importedValue);
    return {
      field,
      existingValue:
        typeof existingValue === "string" || typeof existingValue === "number"
          ? existingValue
          : String(existingValue),
      importedValue:
        typeof importedValue === "string" || typeof importedValue === "number"
          ? importedValue
          : String(importedValue),
      isDifferent,
      importedValueIsInvalid,
    };
  });
}

const RecipeDiffTable: React.FC<RecipeDiffTableProps> = ({
  existing,
  imported,
  invalidFields = [],
  invalidFieldErrors = {},
}) => {
  return (
    <div className="overflow-x-auto mt-2">
      <table className="w-full text-sm border-separate border-spacing-y-1">
        <tbody>
          {diffRecipeFields(existing, imported).map(
            ({
              field,
              existingValue,
              importedValue,
              isDifferent,
              importedValueIsInvalid,
            }) => {
              const isFieldInvalid = invalidFields.includes(field as string);
              const errorMsg = isFieldInvalid
                ? invalidFieldErrors[field as string]
                : undefined;
              return isDifferent ? (
                <React.Fragment key={String(field)}>
                  <tr>
                    <td
                      className={[
                        "pr-2 text-right font-mono align-top w-32",
                        isFieldInvalid
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "",
                      ].join(" ")}
                    >
                      {field}
                      {isFieldInvalid && (
                        <span className="ml-2 flex gap-2 items-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
                          <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
                            {errorMsg}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 line-through align-top">
                      - {String(existingValue)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td
                      className={[
                        "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 font-semibold align-top",
                        importedValueIsInvalid && field === "ingredients"
                          ? "border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/40 relative text-yellow-700 dark:text-yellow-300"
                          : "",
                      ].join(" ")}
                    >
                      + {String(importedValue)}
                      {importedValueIsInvalid && field === "ingredients" && (
                        <span className="ml-2 flex gap-2 items-center">
                          <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
                          <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
                            Incorrect format: should be an array of ingredient
                            objects.
                          </span>
                        </span>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ) : (
                <tr key={String(field)}>
                  <td
                    className={[
                      "pr-2 text-right font-mono align-top w-32",
                      isFieldInvalid
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "",
                    ].join(" ")}
                  >
                    {field}
                    {isFieldInvalid && (
                      <span className="ml-2 flex gap-2 items-center">
                        <AlertTriangle className="w-4 h-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0" />
                        <span className="text-xs text-yellow-700 dark:text-yellow-300 font-normal break-words text-left">
                          {errorMsg}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="align-top">{String(existingValue)}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeDiffTable;
