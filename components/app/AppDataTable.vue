<script setup lang="ts" generic="T">
import { type DataTablePageEvent } from "primevue"

const emit = defineEmits<{ (e: 'page', event: DataTablePageEvent): void }>()

const props = withDefaults(
   defineProps<{
      rows?: T[]
      columns: Array<{ field: string; header: string, width?: string }>
      total?: number
      loading?: boolean
   }>(),
   {
      total: 0,
      loading: false,
   }
)

const page = defineModel<number>("page", { required: false, default: 1 })
const perPage = defineModel<number>("perPage", { required: false, default: 10 })

const perPageOptions = [5, 10, 20, 50, 100]

function onPage(event: DataTablePageEvent) {
   page.value = event.page + 1
   perPage.value = event.rows
   emit('page', event)
}

function showData(
   item: NonNullable<T>,
   column: (typeof props)["columns"][number]
) {
   if (column.field.includes(".")) {
      const keys = column.field.split(".")
      return keys.reduce(
         (acc, key) => (acc as Record<PropertyKey, unknown>)[key] as never,
         item
      )
   }
   return (item as Record<PropertyKey, unknown>)[column.field]
}
</script>

<template>
   <DataTable
      :value="props.rows"
      paginator
      :rows="perPage"
      :first="(page - 1) * perPage"
      :rows-per-page-options="perPageOptions"
      :total-records="props.total"
      :loading="props.loading"
      lazy
      @page="onPage"
   >
      <template
         v-if="$slots.header"
         #header
      >
         <slot name="header" />
      </template>
      <template #empty>
         <slot name="empty">
            <div
               class="flex flex-col items-center justify-center gap-4 py-6 text-surface-500"
            >
               <Icon
                  name="tabler:database-x"
                  class="size-8"
               />
               Data tidak tersedia
            </div>
         </slot>
      </template>
      <template
         v-for="column in props.columns"
         :key="column.field"
      >
         <Column
            :field="column.field"
            :header="column.header"
            :style="{ width: column.width }"
         >
            <template #body="{ data }">
               <slot
                  :name="`row.${column.field}`"
                  :row="data as T"
               >
                  {{ showData(data, column) }}
               </slot>
            </template>
         </Column>
      </template>
   </DataTable>
</template>
