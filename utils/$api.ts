import type { NuxtError } from "#app"
import type {
   NitroFetchRequest,
   NitroFetchOptions,
   TypedInternalResponse,
} from "nitropack"
import type { FetchOptions, FetchResponse } from "ofetch"
import { useCookies } from "@vueuse/integrations/useCookies"
export default async function <
   T = unknown,
   R extends NitroFetchRequest = NitroFetchRequest,
>(endpoint: R, opts?: FetchOptions): Promise<TypedInternalResponse<R, T>> {
   const config = useRuntimeConfig().public
   const token = useAuthStore().token
   const handler = $fetch.create({
      baseURL: config.apiBaseUrl,
      async onRequest({ request, options }) {
         options.headers.set("Accept", "application/json")
         if (token) {
            options.headers.set("Authorization", `Bearer ${token}`)
         }
      },
      async onRequestError({ error }) {
         useAppStore().notify(
            "error",
            "Error",
            error.message ?? "Something went wrong"
         )
         throw error
      },
      async onResponse({ response }) {
         return response._data
      },
      async onResponseError({ response, error }) {
         const res = response as FetchResponse<API.Response<null>>

         // Perbaiki: gunakan 'messages' bukan 'message'
         const errorMessage = res._data?.messages || res._data?.message || "Something went wrong"

         // Hapus notifikasi dari sini, biarkan komponen yang handle
         // useAppStore().notify(
         //    "error",
         //    "Error",
         //    errorMessage
         // )

         const httpStatus = res.status
         const errorMessageLower = errorMessage?.toLowerCase()

         if (httpStatus === 401 || errorMessageLower === 'unauthenticated') {
            useAuthStore().$reset()
            useCookies().remove("MSaTyGbGZg7FP7mfT9hx6yrX6WULKz", { path: "/" })
            await navigateTo("/login")
         } else {
            // Throw error dengan data yang benar
            const customError = new Error(errorMessage)
            throw customError
         }
      }
   })
   return handler<T, R>(endpoint, opts as NitroFetchOptions<R>)
}
