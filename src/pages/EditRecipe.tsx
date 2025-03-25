import { useNavigate, useParams } from "react-router-dom";
import RecipeForm from "@/components/RecipeForm";
import { idbStorage } from "@/lib/storage";
import { Recipe, RecipeFormData } from "@/types/recipe";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core"; // Import Loader component

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = {
    sub: "userId",
  };

  const [recipe, setRecipe] = useState<Recipe | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipeById = async () => {
      setLoading(true);
      if (!id) {
        toast.error("Invalid recipe id");
        navigate("/");
        setLoading(false);
        return;
      }

      try {
        const fetchedRecipe = await idbStorage.getRecipeById(id);

        if (!fetchedRecipe) {
          toast.error("Recipe not found");
          navigate("/");
        }

        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error("Failed to load recipe");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    getRecipeById();
  }, [id, navigate]);

  const handleSubmit = async (data: RecipeFormData) => {
    if (!user?.sub) {
      toast.error("You must be logged in to create a recipe");
      return;
    }

    if (!recipe) {
      toast.error("Recipe data is not loaded yet.");
      return;
    }

    const updatedRecipe: Recipe = {
      ...data,
      id: recipe.id,
      createdAt: recipe.createdAt,
      userId: user.sub,
      updatedAt: Date.now(),
    };

    try {
      await idbStorage.updateRecipe(updatedRecipe);
      toast.success("Recipe updated successfully");
      navigate("/my-recipes");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-2xl mx-auto">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Edit Recipe</h1>
      {recipe && <RecipeForm initialData={recipe} onSubmit={handleSubmit} />}
    </div>
  );
}
