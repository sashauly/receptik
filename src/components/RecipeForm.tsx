// import { useState } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
// import { Camera, Plus, Trash2, Upload } from "lucide-react";
import {
  Button,
  Checkbox,
  NumberInput,
  TextInput,
  Textarea,
  Code,
  Text,
} from "@mantine/core";
// import { recognizeText } from "@/lib/ocr";
import { RecipeFormData } from "@/types/recipe";
// import { toast } from "sonner";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  // ingredients: z
  //   .array(z.string())
  //   .min(1, "At least one ingredient is required"),
  // instructions: z
  //   .array(z.string())
  //   .min(1, "At least one instruction is required"),
  category: z.string().min(1, "Category is required"),
  isPublic: z.boolean(),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number().optional(),
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
  isPublic: false,
  prepTime: undefined,
  cookTime: undefined,
  servings: undefined,
};

export default function RecipeForm({
  onSubmit,
  initialData = initialFormData,
}: RecipeFormProps) {
  // const [ingredients, setIngredients] = useState<string[]>(
  //   initialData?.ingredients || []
  // );
  // const [instructions, setInstructions] = useState<string[]>(
  //   initialData?.instructions || []
  // );
  // const [scanning, setScanning] = useState(false);

  const form = useForm<RecipeFormData>({
    mode: "controlled",
    initialValues: initialData,
    validate: zodResolver(recipeSchema),
  });

  // const handleScan = async (file: File) => {
  //   try {
  //     setScanning(true);
  //     const text = await recognizeText(file);
  //     const lines = text.split("\n").filter((line) => line.trim());
  //     setIngredients((prev) => [...prev, ...lines]);
  //     toast.success("Text successfully extracted from image");
  //   } catch (error: any) {
  //     toast.error("Failed to extract text from image", error);
  //   } finally {
  //     setScanning(false);
  //   }
  // };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     handleScan(file);
  //   }
  // };

  // const addIngredient = () => {
  //   setIngredients((prev) => [...prev, ""]);
  // };

  // const removeIngredient = (index: number) => {
  //   setIngredients((prev) => prev.filter((_, i) => i !== index));
  // };

  // const addInstruction = () => {
  //   setInstructions((prev) => [...prev, ""]);
  // };

  // const removeInstruction = (index: number) => {
  //   setInstructions((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleFormSubmit = (data: RecipeFormData) => {
    onSubmit({
      ...data,
      // ingredients,
      // instructions,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <TextInput
            id="title"
            label="Recipe Title"
            {...form.getInputProps("title")}
          />
          {form.errors.title && (
            <p className="text-sm text-destructive">{form.errors.title}</p>
          )}
        </div>

        <div>
          <Textarea
            id="description"
            label="Description"
            {...form.getInputProps("description")}
          />
          {form.errors.description && (
            <p className="text-sm text-destructive">
              {form.errors.description}
            </p>
          )}
        </div>

        {/* <div>
          <h3>Ingredients</h3>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <TextInput
                  value={ingredient}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = e.target.value;
                    setIngredients(newIngredients);
                  }}
                  placeholder="Enter ingredient"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
              <div className="relative">
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
                      <Camera className="h-4 w-4 mr-2" />
                      Scan List
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Instructions</h3>
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={instruction}
                  onChange={(e) => {
                    const newInstructions = [...instructions];
                    newInstructions[index] = e.target.value;
                    setInstructions(newInstructions);
                  }}
                  placeholder={`Step ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInstruction(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addInstruction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </div> */}

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
          {form.errors.category && (
            <p className="text-sm text-destructive">{form.errors.category}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            label="Make this recipe public"
            {...form.getInputProps("isPublic")}
            className="form-checkbox"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Recipe
      </Button>

      <Text mt="md">Form values:</Text>
      <Code block>{JSON.stringify(form.values, null, 2)}</Code>
    </form>
  );
}
