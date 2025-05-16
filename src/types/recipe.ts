export interface Recipe {
  id: string;
  name: string;
  description?: string;
  slug: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string; // ISO 8601 string duration format
  cookTime: string; // ISO 8601 string duration format
  totalTime: string; // ISO 8601 string duration format
  servings: number;
  keywords?: string[];
  dateCreated: string;
  dateModified: string;
}

// export interface Ingredient {
//   id?: number;
//   name: string;
//   amount: number;
//   unit: string;
//   recipeId?: number;
// }

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
//   dateCreated?: Date;
//   dateModified?: Date;
//   author: string;
//   keywords?: string[];
// }
