declare interface Menu {
   icon: Icon
   title: string
   badge?: number
   pageName?: string
   subMenu?: Menu[]
   ignore?: boolean
}

declare interface MenuState {
   value: Array<Menu | string>
}
type RouteLocationNormalizedLoaded =
   import("vue-router").RouteLocationNormalizedLoaded
declare interface Route extends RouteLocationNormalizedLoaded {}

declare interface FormattedMenu extends Menu {
   active?: boolean
   activeDropdown?: boolean
   subMenu?: FormattedMenu[]
}

declare type ExtractProps<T> = InstanceType<T>["$props"]

type ProvideForceActiveMenu = (pageName: string) => void

type Theme =
   | "dagger"
   | "echo"
   | "exort"
   | "havoc"
   | "hook"
   | "hurricane"
   | "ravage"
   | "raze"
   | "razor"
   | "shuriken"
   | "viper"
