# receptik

## Useful links

[vite-pwa](https://vite-pwa-org.netlify.app/)

## TODO

- [ ] Add ability to add recipes from a URL( requires parsing?)
- [x] Add ability to share recipes
  - [x] Email
  - [x] Telegram
  - [x] Whatsapp
- [ ] Add custom button to install PWA(i think it's now works only in chrome?)
- [ ] Adjust Recipe schema according to schema.org(https://schema.org/Recipe)
  - [ ] add itemProp to all specific elements
  - [x] Consider using units and amount for ingredients
    - [ ] Add US and EU measurement units
  - [ ] Consider adding photos or/and videos for each instructions step
  - [ ] Add ability to specify cuisine
  - [ ] Add ability to specify category

## Issues

- [ ] The import of incorrect, missing or undefined data still counts as sucessfull and leads to more bugs later in EditRecipePage.([ImportRecipe](./src/components/recipe-settings/ImportRecipes.tsx), [useImportRecipe](./src/hooks/recipes/useImportRecipe.ts))
- [ ] Empty ingredient appear in the [CreateRecipePage](./src/pages/CreateRecipePage.tsx) but it rather needs to be in edit mode or doesn't appear at all(so empty array)

## Notes

- operation with localstorage is insecure in safari 16.6.1 macos big sur
