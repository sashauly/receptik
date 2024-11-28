import { useEffect, useState } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { Recipe } from "@/types/recipe";
import { storage } from "@/lib/storage";
import RecipeCard from "@/components/RecipeCard";
import { TextInput, Select } from "@mantine/core";
import { Search } from "lucide-react";

export default function MyRecipes() {
  // const { user } = useAuth0();
  const user = {
    sub: "userId",
  };
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>("");

  useEffect(() => {
    if (user?.sub) {
      setRecipes(storage.getUserRecipes(user.sub));
    }
  }, [user?.sub]);

  const categories = [...new Set(recipes.map((recipe) => recipe.category))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Recipes</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No recipes found. Start by creating your first recipe!
        </div>
      )}
    </div>
  );
}
