<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="bg-white p-6 rounded shadow w-80">
      <h2 class="mb-4 text-xl font-bold">Login</h2>
      <input v-model="username" placeholder="Username" class="mb-2 w-full p-2 border rounded" />
      <input v-model="password" type="password" placeholder="Password" class="mb-4 w-full p-2 border rounded" />
      <button @click="login" class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
})

import { useAuthStore } from '~/stores/auth'
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

async function login() {
  error.value = "";
  const auth = useAuthStore(); 
  try {
    await auth.login({ username: username.value, password: password.value });
    router.push("/");
  } catch (e: any) {
    error.value = e.message || "Username atau password salah";
  }
}
</script>