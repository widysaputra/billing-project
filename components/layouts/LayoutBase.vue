<script setup lang="ts">
import "@/assets/css/themes/razor.css"
import "@/assets/css/components/box.css"

const compactMenu = useCompactMenuStore()
const sideMenu = useSideMenuStore()
</script>

<template>
   <div
      :class="[
         'razor background min-h-screen',
         'before:fixed before:top-0 before:h-screen before:w-full before:bg-gradient-to-b before:from-slate-100 before:to-slate-50 before:content-[\'\']',
         'after:fixed after:inset-0 after:bg-[radial-gradient(rgb(0_0_0_/_10%)_1px,_transparent_0)] after:bg-[length:25px_25px] after:content-[\'\']',
      ]"
   >
      <div
         :class="[
            'side-menu group fixed inset-y-0 top-0 left-0 z-50 shadow-xl transition-[margin] duration-300 xl:ml-0 xl:py-3.5 xl:pl-3.5 xl:shadow-none',
            'after:fixed after:inset-0 after:bg-black/80 after:content-[\'\'] after:xl:hidden',
            { 'side-menu--collapsed': compactMenu.value },
            { 'side-menu--on-hover': compactMenu.onHover },
            { 'ml-0 after:block': sideMenu.activeMobileMenu },
            { '-ml-[275px] after:hidden': !sideMenu.activeMobileMenu },
         ]"
      >
         <div
            :class="[
               'fixed z-50 ml-[275px] h-10 w-10 items-center justify-center xl:hidden',
               { flex: sideMenu.activeMobileMenu },
               { hidden: !sideMenu.activeMobileMenu },
            ]"
         >
            <a
               href=""
               @click="
                  (event) => {
                     event.preventDefault()
                     sideMenu.activeMobileMenu = false
                  }
               "
               class="mt-5 ml-5"
            >
               <Icon
                  name="lucide:x"
                  class="h-8 w-8 text-white"
               />
            </a>
         </div>
         <LayoutSidebar />
         <LayoutTopbar />
      </div>

      <div
         :class="[
            'relative z-10 pt-[65px] pb-16 transition-[margin,width] duration-100 xl:pl-3.5',
            { 'xl:ml-[275px]': !compactMenu.value },
            { 'xl:ml-[91px]': compactMenu.value },
         ]"
      >
         <div class="mt-14 px-5">
            <div class="container">
               <slot />
            </div>
         </div>
      </div>
   </div>
</template>
