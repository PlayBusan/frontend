<template>
  <div class="relative h-screen">
    <SideBar :festivals="festivals" @selectFestival="handleSelectFestival" />

    <KakaoMap
      ref="mapRef"
      @loadedFestivals="handleLoadedFestivals"
      @selectFestival="handleSelectFestival"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import KakaoMap from './components/KakaoMap.vue'
import SideBar from './components/SideBar.vue'

const festivals = ref<any[]>([])
const selectedFestival = ref<any>(null)
const mapRef = ref<InstanceType<typeof KakaoMap> | null>(null)

const normalizeFestival = (festival: any) => ({
  ...festival,
  content_id: festival.content_id || festival.contentid || festival.contentid || '',
  title: festival.title || festival.name || '',
  image:
    festival.image ||
    festival.first_image ||
    festival.firstimage ||
    festival.first_image2 ||
    festival.firstimage2 ||
    '',
  address: festival.addr1 || festival.address || festival.addr || '',
  description: festival.overview || festival.description || festival.tel || festival.intro || '',
})

const handleLoadedFestivals = (loaded: any[]) => {
  festivals.value = loaded.map(normalizeFestival)
}

/**
 * [상세 API 호출] 클릭한 축제의 ID를 받아 상세 정보를 조회합니다.
 */
const fetchFestivalDetail = async (contentId: string | number) => {
  try {
    const response = await axios.get(`/api/festivals/${contentId}`)
    // API 응답 스펙에 맞추어 리턴 (예: response.data 혹은 response.data.data)
    console.log(contentId, '축제 상세 API 호출 결과:', contentId, response.data)
    console.log('축제 상세 데이터:', response.data)
    return response.data?.data || response.data
  } catch (error) {
    console.error('축제 상세 데이터를 가져오는 데 실패했습니다:', error)
    return null
  }
}

/**
 * 사이드바 아이템을 클릭했을 때 실행되는 핸들러
 */
const handleSelectFestival = async (festival: any) => {
  // 1. 클릭한 축제의 주소가 있다면 지도를 해당 위치로 부드럽게 이동시킵니다.
  const addr = festival.addr1 || festival.address
  if (mapRef.value && addr) {
    mapRef.value.moveToAddress(addr)
  }

  // 2. 축제 ID 추출
  const contentId = festival.content_id || festival.contentid

  // 3. ID가 유효한 실제 축제 데이터인 경우 API를 호출하여 상세 데이터를 가져옵니다.
  if (contentId && contentId !== 'selected-hotplace') {
    const detailedData = await fetchFestivalDetail(contentId)
    if (detailedData) {
      selectedFestival.value = normalizeFestival(detailedData)
    } else {
      selectedFestival.value = normalizeFestival(festival)
    }
  } else {
    // 핫플레이스 다이렉트 진입 등 ID가 없는 예외 케이스 처리
    selectedFestival.value = normalizeFestival(festival)
  }
}
</script>
