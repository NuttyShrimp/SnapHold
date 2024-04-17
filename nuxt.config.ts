// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "SnapHold - 12urenloop"
    },
  },
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectURI: process.env.GOOGLE_REDIRECT_URI,
    minioAccessKey: process.env.MINIO_ACCESS_KEY,
    minioSecretKey: process.env.MINIO_SECRET_KEY,
    minioBucket: process.env.MINIO_BUCKET,
  },
  devtools: { enabled: true },
  modules: ['@vite-pwa/nuxt', "@nuxt/ui", "nuxt-security", "dayjs-nuxt", "@nuxt/image"],
  dayjs: {
    plugins: ['utc', 'timezone', 'relativeTime'],
  },
  image: {
    domains: ["minioserver.nuttyshrimp.me"]
  }
})