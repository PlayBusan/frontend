<template>
  <div ref="mapContainer" class="relative w-full h-screen rounded-xl"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { loadKakaoMap } from '@/utils/loadKakaoMap'

const mapContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  await loadKakaoMap()

  if (!mapContainer.value) return

  const options = {
    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
    level: 5,
  }

  new window.kakao.maps.Map(mapContainer.value, options)
})
</script>
