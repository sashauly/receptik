import { Recipe } from "@/types/recipe";
import { base64ToBlob } from "@/utils/export";
import { logInfo } from "@/utils/logger";
import Dexie, { type EntityTable } from "dexie";

const DB_NAME = "receptik-db";
const DB_VERSION = 2;

const db = new Dexie(DB_NAME) as Dexie & {
  recipes: EntityTable<Recipe, "id">;
};

db.version(DB_VERSION).stores({
  recipes:
    "id, name, slug, ingredients, instructions, prepTime, cookTime, totalTime, servings, *keywords, author, createdAt, updatedAt, *images",
});

export const ensureLatestDbSchema = async (): Promise<void> => {
  const currentVersion = db.verno;
  logInfo(`Current database version: ${currentVersion}`);

  localStorage.setItem("db_upgrade_pending", "true");

  if (currentVersion === DB_VERSION) {
    logInfo("Database schema is up to date.");
    return;
  }

  if (currentVersion < DB_VERSION) {
    logInfo(
      `Migrating database schema from v${currentVersion} to v${DB_VERSION}`,
    );
    const recipes = await db.recipes.toArray();
    let migrated = false;
    for (const recipe of recipes) {
      if (recipe.images && recipe.images.length > 0) {
        let needsUpdate = false;
        const newImages = recipe.images.map((img) => {
          const image = img as
            | { data: string; type: string }
            | { data: Blob; type: string };
          if (
            typeof image.data === "string" &&
            image.data.startsWith("data:") &&
            image.data.includes(";base64,")
          ) {
            const blob = base64ToBlob(image.data, image.type);
            if (blob) {
              needsUpdate = true;
              return {
                ...img,
                data: blob,
              };
            } else {
              logInfo(
                `Failed to convert base64 to Blob for image in recipe ${recipe.id}`,
              );
              return img;
            }
          }
          return img;
        });
        if (needsUpdate) {
          await db.recipes.update(recipe.id, { images: newImages });
          migrated = true;
        }
      }
    }
    if (migrated) {
      logInfo("Migrated recipe images from base64 to Blob.");
    }
    window.location.reload();
  }
};

export { db };
