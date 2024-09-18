export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const { data } = await useFetch("/api/user");

  if (data) {
    user.value = data.value;
  }
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login', { replace: true })
  }
});
