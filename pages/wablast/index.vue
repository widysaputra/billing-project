<template>
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
        <Toast />
        <div class="mb-4">
            <label for="target">Target</label>
            <AutoComplete
                v-model="selectedTargets"
                :suggestions="filteredContacts"
                @complete="searchContacts"
                optionLabel="label"
                optionValue="number"
                multiple
                class="w-full"
                placeholder="Cari dan pilih kontak"
            />
        </div>
        <div class="mb-4">
            <label for="message">Message</label>
            <input v-model="message" type="text" id="message" class="w-full p-2 border rounded">
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Kirim" @click="Save" :loading="loading" :disabled="!selectedTargets.length || !message.trim()"></Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

const contacts = ref<{ id: number, name: string, number: string }[]>([])
const filteredContacts = ref<{ label: string, number: string }[]>([])
const selectedTargets = ref<string[]>([])
const message = ref('')
const loading = ref(false)
const toast = useToast();

onMounted(async () => {
    const res = await fetch('http://localhost:8080/contacts')
    const data = await res.json()
    contacts.value = data.data.data
})

function searchContacts(event: { query: string }) {
    const query = event.query?.toLowerCase() || '';
    filteredContacts.value = contacts.value
        .filter(c => c.name.toLowerCase().includes(query) || c.number.includes(query))
        .map(c => ({
            label: `${c.name} (${c.number})`,
            number: c.number
        }));
}

async function Save() {
    if (selectedTargets.value.length === 0 || !message.value.trim()) return;
    loading.value = true;
    try {
        const numbers = selectedTargets.value.map((item: any) => typeof item === 'string' ? item : item.number);
        const url = `http://localhost:8080/send?target=${encodeURIComponent(numbers.join(','))}&message=${encodeURIComponent(message.value)}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.ok) {
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Pesan berhasil dikirim', life: 3000 });
            // Reset input
            selectedTargets.value = [];
            message.value = '';
        } else {
            toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal mengirim pesan', life: 3000 });
        }
    } catch (error) {
        console.error('Error sending message:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat mengirim pesan', life: 3000 });
    } finally {
        loading.value = false;
    }
}
</script>