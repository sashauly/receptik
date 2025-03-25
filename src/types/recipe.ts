export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: string;
  image?: string;
  createdAt?: number;
  updatedAt?: number;
  userId: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

export type RecipeFormData = Omit<
  Recipe,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
