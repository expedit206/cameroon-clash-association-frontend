export default defineNuxtRouteMiddleware((to) => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn.value) {
    return navigateTo('/login');
  }

  if (to.path.startsWith('/admin') && user.value?.role !== 'admin') {
    return navigateTo('/tournaments/register');
  }
});
