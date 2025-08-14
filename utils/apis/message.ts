export function $messageApi() {
 async function getMessages(query?: Record<string, any>) {
   return await $api<API.Response<API.DataTable<Model.Message[]>>>(
    `/messages`,
    {
        method: "GET",
        params: query,
    }
   )
 }

 return {
    getMessages
 }
}