import { Recipe } from "@/types/recipe";
import Dexie, { type EntityTable } from "dexie";
import { logInfo } from "../lib/utils/logger";

const DB_NAME = "receptik-db";

const db = new Dexie(DB_NAME) as Dexie & {
  recipes: EntityTable<Recipe, "id">;
};

db.version(4).stores({
  recipes:
    "id, name, slug, ingredients, instructions, prepTime, cookTime, totalTime, servings, *keywords, author, createdAt, updatedAt, *images",
});

export const ensureLatestDbSchema = async (): Promise<void> => {
  const currentVersion = db.verno;
  logInfo(`Current database version: ${currentVersion}`);

  if (currentVersion < 2) {
    logInfo("Database schema needs updating to v2, will upgrade on next open");

    localStorage.setItem("db_upgrade_pending", "true");
    window.location.reload();
  } else if (currentVersion < 3) {
    logInfo("Database schema needs updating to v3, will upgrade on next open");

    localStorage.setItem("db_upgrade_pending", "true");
    window.location.reload();
  } else if (currentVersion < 4) {
    logInfo("Database schema needs updating to v4, will upgrade on next open");

    localStorage.setItem("db_upgrade_pending", "true");
    window.location.reload();
  }
};

export { db };
