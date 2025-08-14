// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { preset } from "./theme"

const currentDir = dirname(fileURLToPath(import.meta.url))
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },

//   routeRules: {
//    '/billing': { redirect: '/login'}
//   },

  modules: ["@primevue/nuxt-module",'@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon'],
  components: [
      {
         path: join(currentDir, "./components"),
         pathPrefix: false,
      },
   ],

   primevue: {
      options: {
         theme: {
            preset: preset,
            options: {
               darkModeSelector: ".dark-mode",
               cssLayer: {
                  name: "primevue",
                  order: "theme, base, primevue",
               },
            },
         },
      },
   },

  css: [
      join(currentDir, "./assets/css/vendors/simplebar.css"),
      join(currentDir, "./assets/css/tailwind.css"),
      join(currentDir, "./assets/css/themes/razor.css")
   ],
})