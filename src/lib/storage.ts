import { Recipe } from "@/types/recipe";
import { openDB, DBSchema, IDBPDatabase } from "idb";

interface RecipeDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
  };
}

const DB_NAME = "recipe-db";
const OBJECT_STORE_NAME = "recipes";

let db: IDBPDatabase<RecipeDB> | null = null;

const initializeDB = async () => {
  try {
    if (!db) {
      db = await openDB<RecipeDB>(DB_NAME, 1, {
        upgrade(db) {
          // Check if the object store already exists
          if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            db.createObjectStore(OBJECT_STORE_NAME, {
              keyPath: "id",
            });
          }
        },
      });
      console.log("Database initialized successfully."); // Added log
    } else {
      console.log("Database already initialized."); // Added log
    }
  } catch (error) {
    console.error("Error initializing database:", error); // Improved error logging
    throw error; // Re-throw the error to prevent further operations
  }
};

export const idbStorage = {
  getRecipes: async (): Promise<Recipe[]> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, returning empty array."); // Added warning
        return [];
      }
      return await db.getAll(OBJECT_STORE_NAME); // Added await
    } catch (error) {
      console.error("Error getting recipes:", error);
      return []; // Or re-throw, depending on your error handling strategy
    }
  },

  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, returning undefined."); // Added warning
        return undefined;
      }
      return await db.get(OBJECT_STORE_NAME, id); // Added await
    } catch (error) {
      console.error("Error getting recipe by ID:", error);
      return undefined; // Or re-throw
    }
  },

  saveRecipe: async (recipe: Recipe): Promise<void> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, not saving recipe."); // Added warning
        return;
      }
      await db.put(OBJECT_STORE_NAME, recipe); // Added await
    } catch (error) {
      console.error("Error saving recipe:", error);
      throw error; // Or handle differently
    }
  },

  updateRecipe: async (recipe: Recipe): Promise<void> => {
    await idbStorage.saveRecipe(recipe);
  },

  deleteRecipe: async (id: string): Promise<void> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, not deleting recipe."); // Added warning
        return;
      }
      await db.delete(OBJECT_STORE_NAME, id); // Added await
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error; // Or handle
    }
  },
};
