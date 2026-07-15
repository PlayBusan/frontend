<template>
  <aside class="absolute left-0 top-0 z-20 h-full w-auto overflow-y-auto bg-white shadow-xl">
    <div class="p-5">
      <h2 class="mb-5 text-xl font-bold">부산 축제</h2>

      <div
        v-for="festival in festivals"
        :key="festival.content_id"
        class="mb-3 cursor-pointer"
        @click="$emit('selectFestival', festival)"
      >
        <img
          :src="festival.first_image || festival.firstimage || 'https://placehold.co/300x180'"
          class="mb-2 h-50 w-full rounded-md object-cover"
        />

        <div class="font-semibold">
          {{ festival.title }}
        </div>

        <div class="mt-1 text-sm text-slate-500">
          {{ festival.addr1 }}
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  festivals: any[]
}>()

defineEmits<{
  (e: 'selectFestival', festival: any): void
}>()
</script>
