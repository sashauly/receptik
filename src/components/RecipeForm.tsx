import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  NumberInput,
  TextInput,
  Textarea,
  Code,
  Text,
} from "@mantine/core";
import { RecipeFormData } from "@/types/recipe";
import { useCallback, useMemo } from "react";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z
    .array(z.string())
    .nonempty("At least one ingredient is required"),
  instructions: z
    .array(z.string())
    .nonempty("At least one instruction is required"),
  category: z.string().min(1, "Category is required"),
  prepTime: z
    .number()
    .min(1, "The preparation time should be at least more than 1 minute")
    .optional(),
  cookTime: z
    .number()
    .min(1, "The cooking time should be at least more than 1 minute")
    .optional(),
  servings: z.number().min(1, "Do you at least cook for yourself?").optional(),
});

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => void;
  initialData?: RecipeFormData;
}

const initialFormData: RecipeFormData = {
  title: "",
  description: "",
  ingredients: [],
  instructions: [],
  category: "",
  image: "",
  prepTime: undefined,
  cookTime: undefined,
  servings: undefined,
};

export default function RecipeForm({
  onSubmit,
  initialData = initialFormData,
}: RecipeFormProps) {
  const form = useForm<RecipeFormData>({
    mode: "controlled",
    initialValues: initialData,
    validate: zodResolver(recipeSchema),
  });

  const handleFormSubmit = (values: RecipeFormData) => {
    onSubmit(values);
  };

  const addIngredient = useCallback(() => {
    form.insertListItem("ingredients", "");
  }, [form]);

  const removeIngredient = useCallback(
    (index: number) => {
      form.removeListItem("ingredients", index);
    },
    [form]
  );

  const addInstruction = useCallback(() => {
    form.insertListItem("instructions", "");
  }, [form]);

  const removeInstruction = useCallback(
    (index: number) => {
      form.removeListItem("instructions", index);
    },
    [form]
  );

  const formValuesString = useMemo(
    () => JSON.stringify(form.values, null, 2),
    [form.values]
  );

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <TextInput
            id="title"
            label="Recipe Title"
            key={form.key("title")}
            {...form.getInputProps("title")}
          />
        </div>

        <div>
          <Textarea
            id="description"
            label="Description"
            key={form.key("description")}
            {...form.getInputProps("description")}
          />
        </div>

        <div>
          <h3>Ingredients</h3>
          <div className="space-y-2">
            {form.values.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <TextInput
                  value={ingredient}
                  onChange={(e) => {
                    form.setFieldValue(`ingredients.${index}`, e.target.value);
                  }}
                  placeholder="Enter ingredient"
                />
                <Button
                  type="button"
                  variant="filled"
                  color="red"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {form.errors.ingredients && (
                  <Text size="sm" c="red">
                    {form.errors.ingredients}
                  </Text>
                )}
              </div>
            ))}
            {form.errors.ingredients &&
              !Array.isArray(form.errors.ingredients) && (
                <Text size="sm" c="red">
                  {form.errors.ingredients}
                </Text>
              )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
              {/* <div className="relative">
                <TextInput
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="scan-image"
                  onChange={handleImageUpload}
                  disabled={scanning}
                />
                <Button type="button" variant="outline" disabled={scanning}>
                  {scanning ? (
                    "Scanning..."
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Scan List
                    </>
                  )}
                </Button>
              </div> */}
            </div>
          </div>
        </div>

        <div>
          <h3>Instructions</h3>
          <div className="space-y-2">
            {form.values.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => {
                    form.setFieldValue(`instructions.${index}`, e.target.value);
                  }}
                  placeholder={`Step ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="filled"
                  color="red"
                  size="icon"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {form.errors.instructions && (
                  <Text size="sm" c="red">
                    {form.errors.instructions}
                  </Text>
                )}
              </div>
            ))}
            {form.errors.instructions &&
              !Array.isArray(form.errors.instructions) && (
                <Text size="sm" c="red">
                  {form.errors.instructions}
                </Text>
              )}
            <Button type="button" variant="outline" onClick={addInstruction}>
              <Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <NumberInput
              id="prepTime"
              label="Prep Time (minutes)"
              {...form.getInputProps("prepTime", { valueAsNumber: true })}
            />
          </div>
          <div>
            <NumberInput
              id="cookTime"
              label="Cook Time (minutes)"
              {...form.getInputProps("cookTime", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <NumberInput
            id="servings"
            label="Servings"
            {...form.getInputProps("servings", { valueAsNumber: true })}
          />
        </div>

        <div>
          <TextInput
            id="category"
            label="Category"
            {...form.getInputProps("category")}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Recipe
      </Button>

      <Text mt="md">Form values:</Text>
      <Code block>{formValuesString}</Code>
    </form>
  );
}
