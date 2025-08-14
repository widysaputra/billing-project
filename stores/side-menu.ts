export const useSideMenuStore = defineStore("side-menu", () => {
   const forceActiveMenu = ref<string>()

   function setForceActiveMenu(pageName: string) {
      forceActiveMenu.value = pageName
   }

   const activeMobileMenu = ref(false)

   function findActiveMenu(subMenu: Menu[], route: Route) {
      let match = false
      subMenu.forEach((item) => {
         if (
            (route.name?.toString().includes(item.pageName as string) ||
               (forceActiveMenu.value !== undefined &&
                  forceActiveMenu.value.includes(item.pageName as string))) &&
            !item.ignore
         ) {
            match = true
         } else if (!match && item.subMenu) {
            match = findActiveMenu(item.subMenu, route)
         }
      })
      return match
   }

   function nestedMenu(
      menu: Array<MenuState["value"][number] | string>,
      route: Route
   ) {
      const formattedMenu: Array<FormattedMenu | string> = []
      menu.forEach((item) => {
         if (typeof item !== "string") {
            const menuItem: FormattedMenu = {
               icon: item.icon,
               title: item.title,
               pageName: item.pageName,
               subMenu: item.subMenu,
               ignore: item.ignore,
            }
            menuItem.active =
               ((forceActiveMenu.value !== undefined &&
                  menuItem.pageName === forceActiveMenu.value) ||
                  (forceActiveMenu.value === undefined &&
                     menuItem.pageName === route.name) ||
                  (menuItem.subMenu &&
                     findActiveMenu(menuItem.subMenu, route)) ||
                  (!!menuItem.pageName &&
                     typeof route.path === "string" &&
                     route.path.split("/")[0] === menuItem.pageName)) &&
               !menuItem.ignore

            if (menuItem.subMenu) {
               menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, route)

               const subMenu: Array<FormattedMenu> = []
               nestedMenu(menuItem.subMenu, route).map(
                  (menu) => typeof menu !== "string" && subMenu.push(menu)
               )
               menuItem.subMenu = subMenu
            }

            formattedMenu.push(menuItem)
         } else {
            formattedMenu.push(item)
         }
      })

      return formattedMenu
   }

   function linkTo(menu: FormattedMenu) {
      if (menu.subMenu) {
         menu.activeDropdown = !menu.activeDropdown
      } else {
         if (menu.pageName !== undefined) {
            navigateTo({
               name: menu.pageName,
            })
         }
      }
   }

   function enter(el: Element) {
      $transitionSlideDown(el as HTMLElement, 300)
   }

   function leave(el: Element) {
      $transitionSlideUp(el as HTMLElement, 300)
   }

   function $reset() {
      forceActiveMenu.value = undefined
      activeMobileMenu.value = false
   }

   return {
      forceActiveMenu,
      setForceActiveMenu,
      activeMobileMenu,
      nestedMenu,
      linkTo,
      enter,
      leave,
      $reset,
   }
})
