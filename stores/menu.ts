export const useMenuStore = defineStore("menu", () => {
   const value = ref<(Menu | string)[]>([
      "",
      {
         icon: "mdi-account-cash",
         pageName: "contact-create",
         title: "Kontak Baru",
      },
      {
         icon: "mdi-account-group",
         pageName: "contact",
         title: "Data Kontak",
      },
      {
         icon: "mdi-account-group",
         pageName: "monitoring",
         title: "Data Monitoring",
      },
      {
         icon: "mdi-whatsapp",
         pageName: "wablast",
         title: "WhatsApp Blast",
      },
      {
         icon: "mdi-message-text",
         pageName: "messages",
         title: "Messages History",
      },
   ])

   return {
      value
   }
})
