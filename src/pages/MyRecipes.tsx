import { useEffect, useState } from "react";
import { Recipe } from "@/types/recipe";
import { idbStorage } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";
import { TextInput, Select } from "@mantine/core";
import { Search } from "lucide-react";

export default function MyRecipes() {
  const user = {
    sub: "userId",
  };
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      if (user?.sub) {
        const userRecipes = await idbStorage.getUserRecipes(user.sub);
        setRecipes(userRecipes);
      }
      setLoading(false);
    };

    loadRecipes();
  }, [user.sub]);

  const categories = [...new Set(recipes.map((recipe) => recipe.category))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">My Recipes</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <TextInput
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          data={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="mt-8 text-center text-muted-foreground">
          No recipes found. Start by creating your first recipe!
        </div>
      )}
    </div>
  );
}
