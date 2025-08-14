declare namespace API {
   type Response<T> = {
      meta: {
         code: number
         message: string
         status: boolean
         error: string
      }
      data: T
   }

   type DataTable<T> = {
      data: T
      page: number
      per_page: number
      total: number
   }
}
