import { type ToastMessageOptions } from "primevue/toast"

type State = {
   dialog: {
      show: boolean
      title: string
      body: ReturnType<typeof h>
      width: "auto" | `${number}px` | `${number}rem` | `${number}%`
      callback: Function
      closable: boolean
   }
   breadcrumb: Array<{ to?: string; active?: boolean; label: string }> | null
}

export const useAppStore = defineStore("billing-app", {
   state: (): State => ({
      dialog: {
         show: false,
         title: "",
         body: h("div"),
         width: "auto",
         callback: () => {},
         closable: true,
      },
      breadcrumb: [],
   }),

   actions: {
      notify(
         severity: Exclude<ToastMessageOptions["severity"], undefined>,
         title: string,
         detail: string,
         life?: number
      ) {
         const toast = useNuxtApp().vueApp.config.globalProperties.$toast
         toast.add({
            severity,
            summary: title,
            detail,
            life: life ?? 5000,
         })
      },

      showDialog(
         title: string,
         body: ReturnType<typeof h>,
         opts?: Partial<
            Pick<State["dialog"], "width" | "callback" | "closable">
         >
      ) {
         this.$patch((state) => {
            state.dialog.title = title
            state.dialog.body = body
            state.dialog.width = opts?.width ?? "auto"
            state.dialog.callback = opts?.callback ?? (() => {})
            state.dialog.closable = opts?.closable ?? true
            state.dialog.show = true
         })
      },

      closeDialog() {
         this.dialog.show = false
         setTimeout(() => {
            this.$patch((state) => {
               state.dialog.title = ""
               state.dialog.body = h("div")
               state.dialog.width = "auto"
               state.dialog.callback = () => {}
            })
         }, 500)
      },

      setBreadcrumb(breadcrumb: State["breadcrumb"]) {
         if (breadcrumb) {
            useHead({ title: breadcrumb.at(-1)?.label })
         } else {
            useHead({ title: null })
         }
         this.breadcrumb = breadcrumb
      },
   },
})
