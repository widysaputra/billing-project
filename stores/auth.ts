import { ref, computed } from "vue"
import { useCookies } from "@vueuse/integrations/useCookies"
import { $authApi } from '~/utils/apis/auth'


type User = {
   username: string,
   password: string,
}

type State = {
   user: User | null
   token: string | null
}

export const useAuthStore = defineStore("billing-auth", {
   persist: true,
   state: (): State => ({
      user: null,
      token: null,
   }),

   getters: {
      getUser: (state) => state.user,
      getToken: (state) => state.token,
   },

   actions: {
      async login(payload: { username: string; password: string }) {
         const response = await $authApi().login(payload)
         const token = response?.token

         if (!token) {
            throw new Error("Token tidak ditemukan di respons login")
         }

         this.token = token
         this.user = { username: payload.username, password: payload.password }

         return response
      },

      async logout() {
         this.$reset()
         useCookies().remove("MSaTyGbGZg7FP7mfT9hx6yrX6WULKz", { path: "/" })
      },
   }
})
