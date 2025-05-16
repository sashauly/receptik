import { getAllRecipes } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import type { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";


export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
      setLoading(true);
        const allRecipes = await getAllRecipes();
        setRecipes(allRecipes);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        logError("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return { recipes, loading, error, setRecipes };
};

// export function useRecipes() {
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const deleteAllRecipes = useCallback(async () => {
//     try {
//       await deleteAllRecipes();
//       setRecipes([]);
//     } catch (error) {
//       logError("Error deleting all recipes from IndexedDB:", error);
//     }
//   }, []);

//   const getRecipeById = useCallback(
//     (id: string) => {
//       return recipes.find((recipe) => recipe.id === id) || null;
//     },
//     [recipes]
//   );

//   const getRecipeBySlug = useCallback(
//     (slug: string) => {
//       return recipes.find((recipe) => recipe.slug === slug) || null;
//     },
//     [recipes]
//   );

//   const getAllKeywords = useCallback(() => {
//     return Array.from(
//       new Set(recipes.flatMap((recipe) => recipe.keywords || []))
//     );
//   }, [recipes]);

//   const filterRecipes = useCallback(
//     (searchQuery: string, activeKeyword: string) => {
//       return recipes.filter((recipe) => {
//         const matchesSearch =
//           recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           recipe.keywords?.some((keyword) =>
//             keyword.toLowerCase().includes(searchQuery.toLowerCase())
//           );

//         if (activeKeyword === "all") return matchesSearch;
//         return matchesSearch && recipe.keywords?.includes(activeKeyword);
//       });
//     },
//     [recipes]
//   );

//   const importRecipes = useCallback(
//     async (recipesToImport: Recipe[]) => {
//       try {
//         setIsLoading(true);
//         await importRecipes(recipesToImport);
//         await loadRecipes();
//       } catch (error) {
//         logError("Error importing recipes:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [loadRecipes]
//   );

//   return {
//     recipes,
//     isLoading,
//     deleteAllRecipes,
//     getRecipeById,
//     getRecipeBySlug,
//     getAllKeywords,
//     filterRecipes,
//     importRecipes,
//   };
// }
