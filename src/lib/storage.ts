// TODO move logging only on DEV level
import { Recipe } from "@/types/recipe";
import { openDB, DBSchema, IDBPDatabase } from "idb";

interface RecipeDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
  };
}

const DB_NAME = "receptik-db";
const OBJECT_STORE_NAME = "recipes";

let db: IDBPDatabase<RecipeDB> | null = null;

const initializeDB = async () => {
  try {
    if (!db) {
      db = await openDB<RecipeDB>(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            db.createObjectStore(OBJECT_STORE_NAME, {
              keyPath: "id",
            });
          }
        },
      });
      console.log("Database initialized successfully.");
    } else {
      console.log("Database already initialized.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const idbStorage = {
  getRecipes: async (): Promise<Recipe[]> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, returning empty array.");
        return [];
      }
      return await db.getAll(OBJECT_STORE_NAME);
    } catch (error) {
      console.error("Error getting recipes:", error);
      return [];
    }
  },

  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, returning undefined.");
        return undefined;
      }
      return await db.get(OBJECT_STORE_NAME, id);
    } catch (error) {
      console.error("Error getting recipe by ID:", error);
      return undefined;
    }
  },

  saveRecipe: async (recipe: Recipe): Promise<void> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, not saving recipe.");
        return;
      }
      await db.put(OBJECT_STORE_NAME, recipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      throw error;
    }
  },

  updateRecipe: async (recipe: Recipe): Promise<void> => {
    await idbStorage.saveRecipe(recipe);
  },

  deleteRecipe: async (id: string): Promise<void> => {
    try {
      await initializeDB();
      if (!db) {
        console.warn("Database is null, not deleting recipe.");
        return;
      }
      await db.delete(OBJECT_STORE_NAME, id);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  },
};
