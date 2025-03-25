import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { idbStorage } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      const initialRecipes = await idbStorage.getRecipes();
      setRecipes(initialRecipes);
      setLoading(false);
    };

    loadRecipes();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Discover Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length === 0 && <p>No recipes were being found</p>}
        {recipes &&
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
      </div>
    </div>
  );
}
