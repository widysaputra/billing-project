<script setup lang="ts">
import SimpleBar from "simplebar"

const compactMenu = useCompactMenuStore()
function setCompactMenu(val: boolean) {
   compactMenu.setCompactMenu(val)
}

function toggleCompactMenu(event: MouseEvent) {
   event.preventDefault()
   setCompactMenu(!compactMenu.value)
}

const sideMenu = useSideMenuStore()

const route = useRoute()
const menu = computed(() => sideMenu.nestedMenu(useMenuStore().value, route))

let formattedMenu = reactive<Array<FormattedMenu | string>>([])
function setFormattedMenu(
   computedFormattedMenu: Array<FormattedMenu | string>
) {
   Object.assign(formattedMenu, computedFormattedMenu)
}
watch(menu, () => [setFormattedMenu(menu.value)])

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
   sideMenu.setForceActiveMenu(pageName)
   setFormattedMenu(menu.value)
})

const scrollableRef = useTemplateRef<HTMLDivElement>("scrollableRef")

function compactLayout() {
   if (window.innerWidth <= 1600) {
      setCompactMenu(true)
   }
}
onMounted(() => {
   if (scrollableRef.value) {
      new SimpleBar(scrollableRef.value)
   }
   setFormattedMenu(menu.value)
   compactLayout()
   window.onresize = () => {
      compactLayout()
   }
})
</script>

<template>
   <div
      :class="[
         'box from-sky-800 to-teal-600 relative z-20 flex h-full w-[275px] flex-col overflow-hidden rounded-none border-0 bg-gradient-to-b transition-[width] duration-300 xl:rounded-xl group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f]',
         'after:bg-texture-white after:absolute after:inset-0 after:-mr-4 after:bg-contain after:bg-fixed after:bg-[center_-20rem] after:bg-no-repeat after:content-[\'\']',
      ]"
      @mouseover.prevent="compactMenu.onHover = true"
      @mouseleave.prevent="compactMenu.onHover = false"
   >
      <div
         :class="[
            'relative z-10 hidden h-[65px] flex-none items-center overflow-hidden px-5 duration-300 xl:flex xl:w-[275px] group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]',
            'before:absolute before:right-0 before:h-4/6 before:border-r before:border-dashed before:border-white/[0.15] before:content-[\'\'] before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:hidden',
         ]"
      >
         <a
            href="/"
            class="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ml-4 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ml-0"
         >
            <div
               class="transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180"
            >
               <div
                  class="relative h-[18px] w-[18px] -rotate-45 [&_div]:bg-white"
               >
                  <div
                     class="absolute inset-y-0 left-0 my-auto h-[75%] w-[21%] rounded-full opacity-50"
                  ></div>
                  <div
                     class="absolute inset-0 m-auto h-[120%] w-[21%] rounded-full"
                  ></div>
                  <div
                     class="absolute inset-y-0 right-0 my-auto h-[75%] w-[21%] rounded-full opacity-50"
                  ></div>
               </div>
            </div>
            <div
               class="ml-3.5 font-medium text-white transition-opacity group-[.side-menu--collapsed]:xl:opacity-0 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100"
            >
               Billing
            </div>
         </a>
         <a
            href=""
            @click="toggleCompactMenu"
            class="3xl:flex ml-auto hidden h-[20px] w-[20px] items-center justify-center rounded-full border border-white/40 text-white transition-[opacity,transform] hover:bg-white/5 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100"
         >
            <Icon
               name="lucide:arrow-left"
               class="h-3.5 w-3.5 stroke-[1.3]"
            />
         </a>
      </div>
      <div
         ref="scrollableRef"
         :class="[
            'z-20 h-full w-full overflow-x-hidden overflow-y-auto px-5 pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent',
            '[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30',
         ]"
      >
         <ul class="scrollable">
            <!-- BEGIN: First Child -->
            <template v-for="(menu, menuKey) in formattedMenu">
               <li
                  v-if="typeof menu === 'string'"
                  class="side-menu__divider"
                  :key="'divider-' + menuKey"
               >
                  {{ menu }}
               </li>
               <li
                  v-else
                  :key="menuKey"
               >
                  <a
                     href=""
                     :class="[
                        'side-menu__link',
                        { 'side-menu__link--active': menu.active },
                        {
                           'side-menu__link--active-dropdown':
                              menu.activeDropdown,
                        },
                     ]"
                     @click.prevent="
                        () => {
                           sideMenu.linkTo(menu)
                           setFormattedMenu([...formattedMenu])
                        }
                     "
                  >
                     <Icon
                        :name="menu.icon"
                        class="side-menu__link__icon"
                     />
                     <div class="side-menu__link__title">{{ menu.title }}</div>
                     <div
                        v-if="menu.badge"
                        class="side-menu__link__badge"
                     >
                        {{ menu.badge }}
                     </div>
                     <Icon
                        v-if="menu.subMenu"
                        name="lucide:chevron-down"
                        class="side-menu__link__chevron"
                     />
                  </a>
                  <!-- BEGIN: Second Child -->
                  <Transition
                     @enter="sideMenu.enter"
                     @leave="sideMenu.leave"
                  >
                     <ul v-if="menu.subMenu && menu.activeDropdown">
                        <li
                           v-for="(subMenu, subMenuKey) in menu.subMenu"
                           :key="subMenuKey"
                        >
                           <a
                              href=""
                              :class="[
                                 'side-menu__link',
                                 { 'side-menu__link--active': subMenu.active },
                                 {
                                    'side-menu__link--active-dropdown':
                                       subMenu.activeDropdown,
                                 },
                              ]"
                              @click.prevent="
                                 () => {
                                    sideMenu.linkTo(subMenu)
                                    setFormattedMenu([...formattedMenu])
                                 }
                              "
                           >
                              <Icon
                                 :name="subMenu.icon"
                                 class="side-menu__link__icon"
                              />
                              <div class="side-menu__link__title">
                                 {{ subMenu.title }}
                              </div>
                              <div
                                 v-if="subMenu.badge"
                                 class="side-menu__link__badge"
                              >
                                 {{ subMenu.badge }}
                              </div>
                              <Icon
                                 v-if="subMenu.subMenu"
                                 name="lucide:chevron-down"
                                 class="side-menu__link__chevron"
                              />
                           </a>
                           <!-- BEGIN: Third Child -->
                           <Transition
                              @enter="sideMenu.enter"
                              @leave="sideMenu.leave"
                           >
                              <ul
                                 v-if="
                                    subMenu.subMenu && subMenu.activeDropdown
                                 "
                              >
                                 <li
                                    v-for="(
                                       lastSubMenu, lastSubMenuKey
                                    ) in subMenu.subMenu"
                                    :key="lastSubMenuKey"
                                 >
                                    <a
                                       href=""
                                       :class="[
                                          'side-menu__link',
                                          {
                                             'side-menu__link--active':
                                                lastSubMenu.active,
                                          },
                                          {
                                             'side-menu__link--active-dropdown':
                                                lastSubMenu.activeDropdown,
                                          },
                                       ]"
                                       @click.prevent="
                                          () => {
                                             sideMenu.linkTo(lastSubMenu)
                                             setFormattedMenu([
                                                ...formattedMenu,
                                             ])
                                          }
                                       "
                                    >
                                       <Icon
                                          :name="lastSubMenu.icon"
                                          class="side-menu__link__icon"
                                       />
                                       <div class="side-menu__link__title">
                                          {{ lastSubMenu.title }}
                                       </div>
                                       <div
                                          v-if="lastSubMenu.badge"
                                          class="side-menu__link__badge"
                                       >
                                          {{ lastSubMenu.badge }}
                                       </div>
                                    </a>
                                 </li>
                              </ul>
                           </Transition>
                           <!-- END: Third Child -->
                        </li>
                     </ul>
                  </Transition>
                  <!-- END: Second Child -->
               </li>
            </template>
            <!-- END: First Child -->
         </ul>
      </div>
   </div>
</template>
