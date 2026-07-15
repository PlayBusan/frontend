<template>
  <div ref="mapContainer" class="relative w-full h-screen rounded-xl"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadKakaoMap } from '@/utils/loadKakaoMap'

const route = useRoute()
const mapContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  await loadKakaoMap()

  if (!mapContainer.value) return

  const map = new window.kakao.maps.Map(mapContainer.value, {
    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
    level: 5,
  })

  const address = route.query.address as string

  if (!address) return

  const geocoder = new window.kakao.maps.services.Geocoder()
  console.log(route.query.address)
  geocoder.addressSearch(address, (result: any, status: any) => {
    console.log(address)
    console.log(status)
    console.log(result)
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

    new window.kakao.maps.Marker({
      map,
      position: coords,
    })

    map.setCenter(coords)
  })
})
</script>
