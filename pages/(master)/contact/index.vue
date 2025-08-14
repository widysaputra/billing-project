<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { $contactApi } from '~/utils/apis/contact'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

// const appStore = useAppStore()
// appStore.setBreadcrumb([{ label: "Master Obat", active: true }])

const columns = [
   { field: "name", header: "Nama" },
   { field: "number", header: "Nomor Hp" },
   { field: "actions", header: "Aksi", width: '150px' },
]

const confirm = useConfirm();
const toast = useToast();
const router = useRouter();
const { getContacts, updateContact, deleteContact } = $contactApi()

const isDialogVisible = ref(false)
const editingContact: Ref<Model.Contact | null> = ref(null)
const isSaving = ref(false)

const query = ref({
   page: 1,
   limit: 10,
})

const { data: result, pending: loading, refresh } = useLazyAsyncData(
   'contacts-list',
   () => getContacts(query.value),
   {
      server: false,
      transform: res => ({
         items: res.data?.data ?? [],
         total: res.data?.total ?? 0,
      }),
      default: () => ({ items: [] as Model.Contact[], total: 0 }),
      watch: [query],
   },
)

const data = computed(() => result.value?.items ?? [])
const totalRecords = computed(() => result.value?.total ?? 0)

function onPage(event: any) {
   query.value.page = event.page + 1
   query.value.limit = event.rows
}

function handleEdit(contact: Model.Contact) {
  // Buat salinan data untuk diedit agar tidak mengubah data di tabel secara langsung
  editingContact.value = { ...contact };
  isDialogVisible.value = true;
}

async function saveUpdate() {
  if (!editingContact.value) return;

  isSaving.value = true;
  try {
    await updateContact(editingContact.value.id, { name: editingContact.value.name, number: editingContact.value.number });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kontak berhasil diperbarui', life: 3000 });
    isDialogVisible.value = false;
    refresh(); // Memuat ulang data tabel
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal memperbarui kontak', life: 3000 });
  } finally {
    isSaving.value = false;
  }
}

function handleDelete(contact: Model.Contact) {
  confirm.require({
    message: `Apakah Anda yakin ingin menghapus kontak "${contact.name}"?`,
    header: 'Konfirmasi Hapus',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Hapus',
    rejectLabel: 'Batal',
    accept: async () => {
      try {
        await deleteContact(contact.id);
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kontak berhasil dihapus', life: 3000 });
        // Refresh data tabel
        refresh();
      } catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal menghapus kontak', life: 3000 });
      }
    }
  });
}
</script>

<template>
   <div>
      <ConfirmDialog></ConfirmDialog>
      <Toast />
      <Dialog v-model:visible="isDialogVisible" modal header="Edit Kontak" :style="{ width: '25rem' }">
          <div v-if="editingContact" class="flex flex-col gap-4 mt-4">
              <div class="flex flex-col gap-2">
                  <label for="name">Nama</label>
                  <InputText id="name" v-model="editingContact.name" autocomplete="off" />
              </div>
              <div class="flex flex-col gap-2">
                  <label for="number">Nomor Hp</label>
                  <InputText id="number" v-model="editingContact.number" autocomplete="off" />
              </div>
          </div>
          <template #footer>
              <Button label="Batal" severity="secondary" @click="isDialogVisible = false"></Button>
              <Button label="Update" @click="saveUpdate" :loading="isSaving"></Button>
          </template>
      </Dialog>
      <Card>
          <template #title>
            <div class="flex justify-between items-center">
               <span>Daftar Kontak</span>
               <Button label="Tambah Kontak"  class="px-3 py-1 rounded bg-green-500 text-white hover:bg-red-600 transition" icon="pi pi-plus" @click="router.push('/contact/create')" />
            </div>
         </template>
         <template #content>
            <AppDataTable
               :rows="data"
               :columns="columns"
               :loading="loading"
               :total="totalRecords"
               lazy
               @page="onPage"
            >
              <template #row.actions="{ row }">
                <div class="flex justify-center gap-2">
                  <Button
                    icon="mdi-account-group"
                    label="Edit"
                    class="px-3 py-1 rounded bg-green-500 text-white hover:bg-red-600 transition"
                    @click="handleEdit(row)"
                    />
                    <Button
                    icon="pi pi-trash"
                    label="Hapus"
                    class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    @click="handleDelete(row)"
                  />
                </div>
              </template>
            </AppDataTable>
         </template>
</Card>
</div>
</template>
