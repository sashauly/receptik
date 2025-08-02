import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

export const useRecipeCardImages = (recipes: Recipe[] | null | undefined) => {
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (!recipes) {
      setImageUrls(new Map());
      return;
    }

    const urls = new Map<string, string>();
    const cleanupUrls: string[] = [];

    recipes.forEach((recipe) => {
      if (recipe.images && recipe.images.length > 0) {
        const imageBlob = recipe.images[0].data;
        if (imageBlob instanceof Blob) {
          const url = URL.createObjectURL(imageBlob);
          urls.set(recipe.id, url);
          cleanupUrls.push(url);
        }
      }
    });

    setImageUrls(urls);

    // Cleanup function to revoke Object URLs
    return () => {
      cleanupUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [recipes]); // The dependency array ensures this effect runs when `recipes` changes.

  return imageUrls;
};
