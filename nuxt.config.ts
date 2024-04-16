// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "POV - 12urenloop"
    },
  },
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectURI: process.env.GOOGLE_REDIRECT_URI,
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt', "@nuxt/ui"],
  pwa: {
  }
})
