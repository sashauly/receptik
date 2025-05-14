import { logDebug, logError, logInfo, logWarn } from "@/lib/utils/logger"; // Import the helper functions
import { Recipe } from "@/types/recipe";
import { DBSchema, IDBPDatabase, openDB } from "idb";

interface RecipeDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
  };
}

const DB_NAME = "receptik-db";
const OBJECT_STORE_NAME = "recipes";

let db: IDBPDatabase<RecipeDB> | null = null;

const initializeDB = async (): Promise<IDBPDatabase<RecipeDB>> => {
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
        blocked() {
          logError("Database upgrade blocked by the user or another tab.");
        },
        blocking() {
          logWarn(
            "Another tab is blocking the database upgrade. Please close other tabs."
          );
        },
        terminated() {
          logError("Database connection terminated unexpectedly.");
          db = null;
        },
      });
      logInfo("Database initialized successfully.");
    } else {
      logDebug("Database already initialized.");
    }
    return db;
  } catch (error) {
    logError("Error initializing database:", error);
    throw error;
  }
};

export const idbStorage = {
  getRecipes: async (): Promise<Recipe[]> => {
    try {
      const db = await initializeDB();
      return await db.getAll(OBJECT_STORE_NAME);
    } catch (error) {
      logError("Error getting recipes:", error);
      return [];
    }
  },

  getRecipeById: async (id: string): Promise<Recipe | undefined> => {
    try {
      const db = await initializeDB();
      return await db.get(OBJECT_STORE_NAME, id);
    } catch (error) {
      logError("Error getting recipe by ID:", error);
      return undefined;
    }
  },

  saveRecipe: async (recipe: Recipe): Promise<void> => {
    try {
      const db = await initializeDB();
      await db.put(OBJECT_STORE_NAME, recipe);
    } catch (error) {
      logError("Error saving recipe:", error);
      throw error;
    }
  },

  updateRecipe: async (recipe: Recipe): Promise<void> => {
    await idbStorage.saveRecipe(recipe);
  },

  deleteRecipe: async (id: string): Promise<void> => {
    try {
      const db = await initializeDB();
      await db.delete(OBJECT_STORE_NAME, id);
    } catch (error) {
      logError("Error deleting recipe:", error);
      throw error;
    }
  },

  deleteAllRecipes: async (): Promise<void> => {
    try {
      const db = await initializeDB();
      await db.clear(OBJECT_STORE_NAME);
    } catch (error) {
      logError("Error deleting all recipes:", error);
      throw error;
    }
  },

  importRecipes: async (recipes: Recipe[]): Promise<void> => {
    try {
      const db = await initializeDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);

      for (const recipeData of recipes) {
        await store.add(recipeData);
      }

      await tx.done;
      logInfo("Recipes imported successfully.");
    } catch (error) {
      logError("Error importing recipes:", error);
      throw error;
    }
  },

  deleteDatabase: async (): Promise<void> => {
    try {
      if (db) {
        db.close();
        db = null;
      }
      const request = indexedDB.deleteDatabase(DB_NAME);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          logInfo(`Database "${DB_NAME}" deleted successfully.`);
          resolve();
        };

        request.onerror = (event) => {
          logError(
            `Error deleting database "${DB_NAME}":`,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (event.target as any).error
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reject((event.target as any).error);
        };

        request.onblocked = () => {
          logWarn(
            `Database "${DB_NAME}" deletion blocked. Close all connections.`
          );
          reject(
            new Error(
              "Database deletion blocked. Close all connections to the database."
            )
          );
        };
      });
    } catch (error) {
      logError("Error initiating database deletion:", error);
      throw error;
    }
  },
};
