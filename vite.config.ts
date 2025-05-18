import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import i18nextLoader from "vite-plugin-i18next-loader";

export default defineConfig({
  base: "/receptik/",
  plugins: [
    react(),
    tailwindcss(),
    i18nextLoader({
      paths: ["public/locales"],
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      },
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "man-cook.svg",
      ],
      manifest: {
        name: "Receptik",
        short_name: "Receptik",
        description: "A PWA for managing recipes",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        lang: "en",
        display_override: ["window-controls-overlay", "standalone", "browser"],
        categories: ["food", "lifestyle"],
        shortcuts: [
          {
            name: "Add new recipe",
            short_name: "Add recipe",
            description: "Add new recipe to Receptik",
            url: "/receptik/recipes/create",
            icons: [
              {
                src: "plus.svg",
                sizes: "96x96",
                type: "image/svg+xml",
              },
            ],
          },
        ],
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "screenshots/android/homeAndroid.png",
            sizes: "1081x2222",
            type: "image/png",
            form_factor: "narrow",
            platform: "android",
            label: "Home screen showing main navigation and featured content",
          },
          {
            src: "screenshots/android/recipeAndroid.png",
            sizes: "1081x2222",
            type: "image/png",
            form_factor: "narrow",
            platform: "android",
            label: "Recipe screen showing recipe details",
          },
          {
            src: "screenshots/android/newAndroid.png",
            sizes: "1081x2222",
            type: "image/png",
            form_factor: "narrow",
            platform: "android",
            label: "Recipe screen showing recipe creation form",
          },
          {
            src: "screenshots/ios/homeIos.png",
            sizes: "828x1792",
            type: "image/png",
            form_factor: "narrow",
            platform: "ios",
            label: "Home screen showing main navigation and featured content",
          },
          {
            src: "screenshots/ios/recipeIos.png",
            sizes: "828x1792",
            type: "image/png",
            form_factor: "narrow",
            platform: "ios",
            label: "Recipe screen showing recipe details",
          },
          {
            src: "screenshots/ios/newIos.png",
            sizes: "828x1792",
            type: "image/png",
            form_factor: "narrow",
            platform: "ios",
            label: "Recipe screen showing recipe creation form",
          },
          {
            src: "screenshots/desktop/homeDesktop.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide",
            platform: "windows",
            label: "Home screen showing main navigation and featured content",
          },
          {
            src: "screenshots/desktop/recipeDesktop.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide",
            platform: "windows",
            label: "Recipe screen showing recipe details",
          },
          {
            src: "screenshots/desktop/newDesktop.png",
            sizes: "1366x768",
            type: "image/png",
            form_factor: "wide",
            platform: "windows",
            label: "Recipe screen showing recipe creation form",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
