import { Recipe } from "@/types/recipe";

const RECIPES_KEY = "recipes";

export const storage = {
  getRecipes: (): Recipe[] => {
    const recipes = localStorage.getItem(RECIPES_KEY);
    return recipes ? JSON.parse(recipes) : [];
  },

  getRecipeById: (id: string): Recipe | undefined => {
    const recipes = storage.getRecipes();
    return recipes.find((recipe) => recipe.id === id);
  },

  saveRecipe: (recipe: Recipe): void => {
    const recipes = storage.getRecipes();
    recipes.push(recipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  },

  updateRecipe: (recipe: Recipe): void => {
    const recipes = storage.getRecipes();
    const index = recipes.findIndex((r) => r.id === recipe.id);
    if (index !== -1) {
      recipes[index] = recipe;
      localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    }
  },

  deleteRecipe: (id: string): void => {
    const recipes = storage.getRecipes();
    const filtered = recipes.filter((recipe) => recipe.id !== id);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(filtered));
  },

  getUserRecipes: (userId: string): Recipe[] => {
    return storage.getRecipes().filter((recipe) => recipe.userId === userId);
  },

  getPublicRecipes: (): Recipe[] => {
    return storage.getRecipes().filter((recipe) => recipe.isPublic);
  },
};
