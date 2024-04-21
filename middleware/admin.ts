export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser();
  if (user.value?.admin) {
    return navigateTo('/', { replace: true })
  }
})
