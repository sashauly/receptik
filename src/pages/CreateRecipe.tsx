import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import RecipeForm from "@/components/RecipeForm";
import { idbStorage } from "@/lib/storage";
import { Recipe, RecipeFormData } from "@/types/recipe";
import { toast } from "sonner";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const user = {
    sub: "userId",
  };

  const handleSubmit = async (data: RecipeFormData) => {
    if (!user?.sub) {
      toast.error("You must be logged in to create a recipe");
      return;
    }

    const newRecipe: Recipe = {
      ...data,
      id: uuidv4(),
      userId: user.sub,
      createdAt: Date.now(),
    };

    await idbStorage.saveRecipe(newRecipe);
    toast.success("Recipe created successfully");
    navigate("/my-recipes");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
}
