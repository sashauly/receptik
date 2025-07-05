import { transliterate as tr, slugify } from "transliteration";

export function generateSlug(title: string): string {
  const latinizedTitle = tr(title);
  return slugify(latinizedTitle);
}

export function getUniqueSlug(title: string, existingSlugs: string[]): string {
  const slug = generateSlug(title);
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
