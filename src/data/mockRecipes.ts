// src/data/mockRecipes.ts
import { Recipe } from "@/types/recipe"; // Assuming your Recipe type

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Classic Spaghetti Bolognese",
    slug: "classic-spaghetti-bolognese",
    author: "Chef John",
    ingredients: [
      {
        name: "Pasta",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Ground Beef",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Tomatoes",
        amount: 1,
        unit: "piece",
      },
    ],
    instructions: ["Cook pasta.", "Make sauce.", "Combine."],
    prepTime: "PT15M", // ISO 8601 duration format
    cookTime: "PT45M",
    totalTime: "PT1H",
    servings: 4,
    keywords: ["Italian", "Dinner", "Pasta"],
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T10:00:00Z"),
  },
  {
    id: "2",
    name: "Quick Chicken Stir-fry",
    slug: "quick-chicken-stir-fry",
    author: "Chef Sarah",
    ingredients: [
      {
        name: "Chicken",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Vegetables",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Soy Sauce",
        amount: 1,
        unit: "piece",
      },
    ],
    instructions: ["Cut chicken.", "Stir-fry.", "Serve."],
    prepTime: "PT10M",
    cookTime: "PT20M",
    totalTime: "PT30M",
    servings: 2,
    keywords: ["Asian", "Dinner", "Quick"],
    createdAt: new Date("2023-02-15T12:30:00Z"),
    updatedAt: new Date("2023-02-15T12:30:00Z"),
  },
  {
    id: "3",
    name: "Healthy Quinoa Salad",
    slug: "healthy-quinoa-salad",
    author: "Chef Maria",
    ingredients: [
      // Array of ingredients
      {
        name: "Quinoa",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Cucumber",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Tomatoes",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Feta",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Olive Oil",
        amount: 2,
        unit: "tbsp",
      },
      {
        name: "Garlic",
        amount: 1,
        unit: "clove",
      },
      {
        name: "Salt",
        amount: 1,
        unit: "tsp",
      },
      {
        name: "Pepper",
        amount: 1,
        unit: "pinch",
      },
    ],
    instructions: ["Cook quinoa.", "Chop veggies.", "Mix.", "Serve."],
    prepTime: "PT20M",
    cookTime: "PT15M",
    totalTime: "PT35M",
    servings: 3,
    keywords: ["Healthy", "Salad", "Lunch", "Vegetarian"],
    createdAt: new Date("2023-03-20T09:00:00Z"),
    updatedAt: new Date("2023-03-20T09:00:00Z"),
  },
  {
    id: "4",
    name: "Simple Pancakes",
    slug: "simple-pancakes",
    author: "Chef Mike",
    ingredients: [
      // Array of ingredients
      {
        name: "Flour",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Eggs",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Milk",
        amount: 1,
        unit: "cup",
      },
    ],
    instructions: ["Mix ingredients.", "Cook on griddle."],
    prepTime: "PT5M",
    cookTime: "PT10M",
    totalTime: "PT15M",
    servings: 2,
    keywords: ["Breakfast", "Dessert"],
    createdAt: new Date("2023-04-10T08:00:00Z"),
    updatedAt: new Date("2023-04-10T08:00:00Z"),
  },
  {
    id: "5",
    name: "Vegetable Curry",
    slug: "vegetable-curry",
    author: "Chef Raj",
    ingredients: [
      // Array of ingredients
      {
        name: "Mixed Veg",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Curry Paste",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Coconut Milk",
        amount: 1,
        unit: "cup",
      },
      {
        name: "Curry Powder",
        amount: 1,
        unit: "tsp",
      },
      {
        name: "Garam Masala",
        amount: 1,
        unit: "tsp",
      },

      {
        name: "Salt",
        amount: 1,
        unit: "pinch",
      },
      {
        name: "Pepper",
        amount: 1,
        unit: "clove",
      },
    ],
    instructions: ["Saute veggies.", "Add curry paste.", "Simmer."],
    prepTime: "PT15M",
    cookTime: "PT30M",
    totalTime: "PT45M",
    servings: 4,
    keywords: ["Indian", "Dinner", "Vegetarian"],
    createdAt: new Date("2023-05-01T17:00:00Z"),
    updatedAt: new Date("2023-05-01T17:00:00Z"),
  },
  {
    id: "6",
    name: "Lemon Herb Baked Salmon",
    slug: "lemon-herb-baked-salmon",
    author: "Chef Emma",
    ingredients: [
      // Array of ingredients
      {
        name: "Salmon",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Lemon",
        amount: 1,
        unit: "piece",
      },
      {
        name: "Herbs",
        amount: 1,
        unit: "piece",
      },

      {
        name: "Garlic",
        amount: 1,
        unit: "clove",
      },
      {
        name: "Salt",
        amount: 1,
        unit: "tsp",
      },
      {
        name: "Pepper",
        amount: 1,
        unit: "pinch",
      },
    ],
    instructions: ["Season salmon.", "Bake."],
    prepTime: "PT10M",
    cookTime: "PT25M",
    totalTime: "PT35M",
    servings: 2,
    keywords: ["Fish", "Healthy", "Dinner"],
    createdAt: new Date("2023-06-05T18:00:00Z"),
    updatedAt: new Date("2023-06-05T18:00:00Z"),
  },
];
