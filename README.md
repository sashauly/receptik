# receptik

## Useful links

[vite-pwa](https://vite-pwa-org.netlify.app/)

## TODO

- [ ] - Add settings page
  - [x] Add route and component (08.04.2025)
  - [x] Add theming(system, dark mode, light mode) (09.04.2025)
  - [x] Add multiple translations
  - [x] Add ability to import all recipes from a file
  - [x] Add ability to export all recipes to a file
  - [x] Add ability to reset all data
  - [ ] Add immediate refresh
  - [ ] Add ability to turn off confirmation dialogs
- [ ] Add ability to add recipes from a file
  - [ ] import for one or multiple recipes
  - [ ] Maybe add ability to upload one recipe directly from JSON string
- [ ] Add ability to add recipes from a URL( requires parsing?)
- [ ] Add ability to share recipes
  - [ ] Email
  - [ ] Telegram
  - [ ] Whatsapp
- [ ] Add ability to upload images
  - [ ] Implement upload functionality from desktop and mobile
  - [ ] Implement storage in IndexedDB (as base64 encoded string)
  - [ ] Add ability to add photo using camera
  - [ ] Add ability to delete images
- [x] Add custom button to install PWA(i think it's now works only in chrome?)
- [x] Consider changing some UI elements to drawers
- [ ] Adjust Recipe schema according to schema.org(https://schema.org/Recipe)
  - [ ] add itemProp to all specific elements
  - [x] Consider using units and amount for ingredients
    - [ ] Add US and EU measurement units
  - [ ] Consider adding photos or/and videos for each instructions step
  - [ ] Add ability to specify cuisine
  - [ ] Add ability to specify category
  - [ ] Add ability to specify author
- [x] Move all logging to DEV level
- [x] Add toasts on success, warn and error
- [ ] Adjust UI/UX for mobile (!)
- [ ] Create separate page for choosing units of ingredients for mobile
- [ ] Move search to separate page
- [x] Add auto calculation of amount of ingredients based on number of servings
- [ ] refine UI components in the form
- [ ] refine UI components in recipe detail
- [ ] refactor Home page

## Notes

- operation with localstorage is insecure in safari 16.6.1 macos big sur
