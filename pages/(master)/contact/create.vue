<template>
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <Toast />
        <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama</label>
            <input v-model="form.name" type="text" id="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
         <div class="mb-4">
            <label for="number" class="block text-gray-700 text-sm font-bold mb-2">Nomor Hp</label>
            <input v-model="form.number" type="text" id="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Batal" severity="secondary" @click="router.push('contact')"></Button>
            <Button type="button" label="Simpan" @click="save" :loading="loading"></Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { $contactApi } from '~/utils/apis/contact';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const { createContact } = $contactApi();
const toast = useToast();
const router = useRouter();
const loading = ref(false);

const form = ref({
  name: '',
  number: ''
});

async function save() {
    loading.value = true;
    try {
        await createContact(form.value);
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kontak berhasil ditambahkan', life: 3000 });
        router.push('/contact');
    } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal menambahkan kontak', life: 3000 });
    } finally {
        loading.value = false;
    }
}

</script>