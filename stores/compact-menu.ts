import { defineStore } from "pinia"

interface CompactMenuState {
   value: boolean
   onHover: boolean
}

const getCompactMenu = () => {
   if (import.meta.client) {
      if (localStorage.getItem("compactMenu")) {
         return localStorage.getItem("compactMenu") === "true" ? true : false
      } else {
         return false
      }
   }
   return false // Default value when not on the client-side
}

export const useCompactMenuStore = defineStore("compactMenu", {
   state: (): CompactMenuState => ({
      value:
         import.meta.client && localStorage.getItem("compactMenu") === null
            ? false
            : getCompactMenu(),
      onHover: false,
   }),
   getters: {
      compactMenu(state) {
         if (import.meta.client) {
            if (localStorage.getItem("compactMenu") === null) {
               localStorage.setItem("compactMenu", "false") // Set default to "true"
            }
         }
         return state.value
      },
   },
   actions: {
      setCompactMenu(compactMenu: boolean) {
         if (import.meta.client) {
            localStorage.setItem("compactMenu", compactMenu.toString())
         }
         this.value = compactMenu
      },
   },
})
