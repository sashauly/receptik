import { db } from "@/data/db";
import { useLiveQuery } from "dexie-react-hooks"; // Still need this import
// import { useEffect } from "react";

export const useRecipes = () => {
  const recipes = useLiveQuery(() => db.recipes.toArray(), []);

  const isLoading = recipes === undefined;

  const error: Error | null = null;

  // useEffect(() => {}, [recipes]);

  return { recipes: recipes || [], loading: isLoading, error };
};
