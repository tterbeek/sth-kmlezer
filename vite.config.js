// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto", // automatically registers SW in prod
      includeAssets: ["icons/192.png", "icons/512.png", "icons/1024.png"],
      manifest: true, // we use public/manifest.json instead
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Don't try to cache MP4 videos; always stream from network
            urlPattern: /.*\.(?:mp4)$/,
            handler: "NetworkOnly"
          }
        ]
      }
    })
  ]
});
