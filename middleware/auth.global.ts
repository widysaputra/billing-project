import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  if (process.client) {
    if (!auth.token && to.path !== "/login") {
      return navigateTo("/login");
    }
  }
});