export function $contactApi() {
 async function getContacts(query?: Record<string, any>) {
   return await $api<API.Response<API.DataTable<Model.Contact[]>>>(
    `/contacts`,
    {
        method: "GET",
        params: query,
    }
   )
 }

 async function getContact(id: number) {
   return await $api<API.Response<Model.Contact>>(
     `/contacts/${id}`,
     {
       method: "GET",
     }
   )
 }

 async function updateContact(id: number, body: Partial<Omit<Model.Contact, 'id'>>) {
   return await $api<API.Response<Model.Contact>>(
     `/contacts/${id}`,
     {
       method: "PUT",
       body,
     }
   )
 }

 async function deleteContact(id: number) {
  return await $api<API.Response<null>>(
    `/contacts/${id}`,
    {
      method: "DELETE",
    }
  )
 }

 async function createContact(body: Partial<Omit<Model.Contact, 'id'>>) {
   return await $api<API.Response<Model.Contact>>(
     `/contacts`,
     {
       method: "POST",
       body,
     }
   )
 }

 return {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact
 }
}