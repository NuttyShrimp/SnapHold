export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const { data } = await useFetch("/api/user");

  if (data) {
    user.value = data.value;
  } else if (to.path !== "/login") {
    return navigateTo("/login");
  }
});
