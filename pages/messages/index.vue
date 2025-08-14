<script setup lang="ts">
import { ref, computed } from 'vue'
import { $messageApi } from '~/utils/apis/message'

// const appStore = useAppStore()
// appStore.setBreadcrumb([{ label: "Master Obat", active: true }])

const columns = [
   { field: "target", header: "No Target" },
   { field: "message", header: "Pesan" },
   { field: "status", header: "Status" },
   { field: "sent_at", header: "Dikirim Pada" },
]

const { getMessages } = $messageApi()

const query = ref({
   page: 1,
   limit: 10,
})

const { data: result, pending: loading } = useLazyAsyncData(
   'messages',
   () => getMessages(query.value),
   {
      server: false,
      transform: res => ({
         items: res.data?.data ?? [],
         total: res.data?.total ?? 0,
      }),
      default: () => ({ items: [] as Model.Message[], total: 0 }),
      watch: [query],
   },
)

const data = computed(() => result.value?.items ?? [])
const totalRecords = computed(() => result.value?.total ?? 0)

function onPage(event: any) {
   query.value.page = event.page + 1
   query.value.limit = event.rows
}
</script>

<template>
   <div>
      <Card>
         <template #content>
            <AppDataTable
               :rows="data"
               :columns="columns"
               :loading="loading"
               :total="totalRecords"
               lazy
               @page="onPage"
            >
            </AppDataTable>
         </template>
</Card>
</div>
</template>
