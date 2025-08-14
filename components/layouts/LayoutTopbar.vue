<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
const sideMenu = useSideMenuStore()
const auth = useAuthStore()

async function logout() {
  await auth.logout()
  window.location.href = "/login";
}
</script>

<template>
   <div
      :class="[
         'fixed inset-x-0 top-0 mt-1 h-[65px] transition-[margin] duration-100 xl:ml-[275px] group-[.side-menu--collapsed]:xl:ml-[90px]',
         'before:absolute before:inset-x-0 before:top-0 before:mx-5 before:-mt-[15px] before:h-[20px] before:backdrop-blur before:content-[\'\']',
      ]"
   >
      <div
         class="group box before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60 absolute right-0 left-0 mx-5 h-full transition-colors duration-200 ease-in-out before:absolute before:inset-x-4 before:top-0 before:z-[-1] before:mx-auto before:mt-3 before:h-full before:rounded-lg before:border before:border-slate-200 before:bg-slate-50 before:shadow-sm before:content-[''] xl:left-3.5"
      >
         <div
            class="flex h-full w-full items-center px-5 transition-[padding] duration-300 ease-in-out"
         >
            <div class="flex items-center gap-1 xl:hidden">
               <a
                  href=""
                  @click.prevent="sideMenu.activeMobileMenu = true"
                  class="rounded-full p-2 hover:bg-slate-100"
               >
                  <Icon
                     name="lucide:align-justify"
                     class="h-[18px] w-[18px]"
                  />
               </a>
            </div>
            <!-- SECTION: Breadcrumb -->
            <!-- !SECTION: Breadcrumb -->
            <!-- SECTION: Notification & User Menu -->
            <div class="flex flex-1 items-center">
               <div class="ml-auto flex items-center gap-2">
                  <button
                     @click="logout"
                     class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                     Logout
                  </button>
               </div>
            </div>
            <!-- !SECTION: Notification & User Menu -->
         </div>
      </div>
   </div>
</template>
