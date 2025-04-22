export interface Recipe {
  id: string;
  title: string;
  slug: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
