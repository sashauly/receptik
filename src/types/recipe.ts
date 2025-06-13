import { UnitValue } from "@/lib/measurements";

export interface Ingredient {
  id?: string;
  name: string;
  amount: number | null;
  unit: string | UnitValue;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: string; // ISO 8601 string duration format
  cookTime: string; // ISO 8601 string duration format
  totalTime: string; // ISO 8601 string duration format
  servings: number;
  keywords?: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

// export interface RecipeImage {
//   id?: number;
//   name: string;
//   data: string; // Base64 encoded image data
//   recipeId?: number;
// }

// // based on https://schema.org/Recipe
// export interface Recipe {
//   id: string;
//   slug?: string;
//   name: string;
//   description: string;
//   // image: RecipeImage;
//   prepTime?: string; // ISO 8601 duration format
//   cookTime: string; // ISO 8601 duration format
//   totalTime?: string; // ISO 8601 duration format
//   ingredients: Ingredient[]; // recipeIngredient
//   instructions: string[]; // instructions
//   servings: number; // recipeYield
//   category?: string[]; // recipeCategory
//   cuisine?: string[]; // recipeCuisine
//   createdAt?: Date;
//   updatedAt?: Date;
//   author: string;
//   keywords?: string[];
// }
