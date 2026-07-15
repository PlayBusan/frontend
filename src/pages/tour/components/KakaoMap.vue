<template>
  <div class="relative w-full h-screen">
    <div ref="mapContainer" class="w-full h-full rounded-xl"></div>

    <!-- 마커 클릭시 카드 -->
    <div v-if="selectedFestival" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div class="w-72 overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">
        <div class="relative h-44 w-full bg-slate-100">
          <img :src="selectedFestival.image" class="h-full w-full object-cover" />
        </div>

        <div class="p-5">
          <div class="mb-3 inline-flex rounded-full bg-secondary/20 px-3 py-1">
            <span class="text-xs font-bold text-primary"> #축제 </span>
          </div>

          <h4 class="text-lg font-black text-slate-800">
            {{ selectedFestival.title }}
          </h4>

          <p class="text-sm text-gray-600">
            {{ selectedFestival.address }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadKakaoMap } from '@/utils/loadKakaoMap'

const route = useRoute()
const mapContainer = ref<HTMLDivElement | null>(null)
const selectedFestival = ref<any>(null)

const title = route.query.title as string
const address = route.query.address as string
const image = route.query.image as string

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

  geocoder.addressSearch(address, (result: any, status: any) => {
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

    const marker = new window.kakao.maps.Marker({
      map,
      position: coords,
    })

    map.setCenter(coords)

    console.log(image, title, address)

    // 마우스를 올리면 카드 표시
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      selectedFestival.value = {
        title,
        address,
        image,
      }
    })

    // 마우스를 떼면 카드 숨김
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      selectedFestival.value = null
    })
  })
})
</script>
