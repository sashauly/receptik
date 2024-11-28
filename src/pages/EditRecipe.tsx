import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "@/components/RecipeForm";
import { storage } from "@/lib/storage";
import { Recipe, RecipeFormData } from "@/types/recipe";
import { toast } from "sonner";

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = {
    sub: "userId",
  };
  if (!id) {
    toast.error("Invalid recipe id");
    navigate("/");
  }

  const recipe = storage.getRecipeById(id as string);

  if (!recipe) {
    toast.error("Recipe not found");
    navigate("/");
  }

  const handleSubmit = (data: RecipeFormData) => {
    console.log("🚀 ~ handleSubmit ~ data:", data);
    if (!user?.sub) {
      toast.error("You must be logged in to create a recipe");
      return;
    }

    const updatedRecipe: Recipe = {
      ...data,
      id: recipe!.id,
      createdAt: recipe?.createdAt,
      userId: user.sub,
      updatedAt: Date.now(),
    };

    storage.updateRecipe(updatedRecipe);
    toast.success("Recipe created successfully");
    navigate("/my-recipes");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} />
    </div>
  );
}
