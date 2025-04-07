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
  }
};

export const idbStorage = {
  getRecipes: async (): Promise<Recipe[]> => {
    await initializeDB();
    if (!db) return [];
    return db.getAll(OBJECT_STORE_NAME);
  },

  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    await initializeDB();
    if (!db) return undefined;
    return db.get(OBJECT_STORE_NAME, id);
  },

  saveRecipe: async (recipe: Recipe): Promise<void> => {
    await initializeDB();
    if (!db) return;
    await db.put(OBJECT_STORE_NAME, recipe);
  },

  updateRecipe: async (recipe: Recipe): Promise<void> => {
    await idbStorage.saveRecipe(recipe);
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await initializeDB();
    if (!db) return;
    await db.delete(OBJECT_STORE_NAME, id);
  },
};
