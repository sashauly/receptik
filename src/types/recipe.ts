export interface Recipe {
  id: string;
  title: string;
  slug: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
