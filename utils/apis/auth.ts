export function $authApi() {
   async function login(body: { username: string; password: string }) {
      return await $api<Model.Auth>(`/login`, {
         method: "post",
         body,
      })
   }

   return { login }
}