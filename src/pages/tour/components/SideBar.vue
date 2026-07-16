<template>
  <aside
    class="absolute left-5 top-5 z-20 h-[90vh] rounded-lg w-auto overflow-y-auto bg-white shadow-xl"
  >
    <div class="p-5 w-100">
      <div class="mb-5">
        <span class="text-sm text-gray-500 font-semibold">지금 부산은 축제 중!</span>
        <h2 class="mb-5 text-xl font-bold text-primary">7월 축제 둘러보기😎</h2>
      </div>

      <div
        v-for="festival in festivals"
        :key="festival.content_id"
        class="group mb-3 cursor-pointer"
        @click="$emit('selectFestival', festival)"
      >
        <div class="overflow-hidden rounded-md">
          <img
            :src="festival.first_image || festival.firstimage || 'https://placehold.co/300x180'"
            class="h-50 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
          />
        </div>

        <div class="mt-2 font-semibold">
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
