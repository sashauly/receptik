import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { storage } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(storage.getPublicRecipes());
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Discover Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
