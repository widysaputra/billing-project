declare namespace API {
   namespace Request {
      namespace Query {
         type Contact = API.Request.Paginable & API.Request.Searchable & {}
         type Message = API.Request.Paginable & API.Request.Searchable & {}
      }
   }
}
