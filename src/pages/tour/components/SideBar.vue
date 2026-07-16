<template>
  <aside
    class="absolute left-5 top-20 z-20 h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg bg-white shadow-xl md:w-[360px]"
  >
    <div class="p-5">
      <div class="mb-5">
        <span class="text-sm text-gray-500 font-semibold">지금 부산은 축제 중!</span>
        <h2 class="mb-5 text-xl font-bold text-primary">7월 축제 둘러보기😎</h2>
      </div>

      <div v-if="festivalList.length === 0" class="mb-5 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        축제가 아직 로드되지 않았습니다.
      </div>

      <div v-for="(festival, index) in festivalList" :key="festival.content_id ?? festival.title ?? index" class="group mb-4 cursor-pointer rounded-2xl border border-slate-200 p-3 transition hover:border-primary/50 hover:bg-primary/5" @click="$emit('selectFestival', festival)">
        <div class="overflow-hidden rounded-xl">
          <img
            :src="getFestivalImage(festival)"
            class="h-40 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
        <div class="mt-3 font-semibold text-slate-800">{{ festival.title }}</div>
        <div class="mt-1 text-sm text-slate-500">{{ festival.address }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  festivals: any[]
}>()

const emit = defineEmits<{
  (e: 'selectFestival', festival: any): void
}>()

const getFestivalImage = (festival: any) =>
  festival.image ||
  festival.first_image ||
  festival.firstimage ||
  festival.first_image2 ||
  festival.firstimage2 ||
  'https://placehold.co/300x180'

const festivalList = computed(() => {
  return props.festivals
})
</script>
