<template>
  <aside
    class="absolute left-5 top-20 z-20 h-[90vh] rounded-lg w-auto overflow-y-auto bg-white shadow-xl"
  >
    <div class="p-5 w-100">
      <div class="mb-5">
        <span class="text-sm text-gray-500 font-semibold">지금 부산은 축제 중!</span>
        <h2 class="mb-5 text-xl font-bold text-primary">7월 축제 둘러보기😎</h2>
      </div>

      <div v-if="selectedFestival" class="mb-5 rounded-3xl border border-slate-200 p-4 bg-slate-50">
        <div class="overflow-hidden rounded-2xl">
          <img
            :src="selectedFestival.first_image || selectedFestival.firstimage || selectedFestival.image || 'https://placehold.co/400x250'
            "
            class="h-48 w-full object-cover"
          />
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-bold text-slate-900">{{ selectedFestival.title }}</h3>
          <p class="mt-2 text-sm text-slate-500">{{ selectedFestival.addr1 || selectedFestival.address }}</p>
          <p class="mt-3 text-sm leading-6 text-slate-600">
            {{ selectedFestival.overview || selectedFestival.description || selectedFestival.tel || '지도에서 선택한 축제 정보를 보여줍니다.' }}
          </p>
        </div>
      </div>

      <div v-else class="mb-5 rounded-3xl border border-slate-200 p-4 bg-slate-50 text-sm text-slate-600">
        캘린더에서 행사를 선택하거나 지도에서 마커를 클릭하면 자세한 축제 정보가 여기에 표시됩니다.
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
  selectedFestival: any | null
}>()

defineEmits<{
  (e: 'selectFestival', festival: any): void
}>()
</script>
