<template>
  <div ref="mapContainer"  class="absolute inset-0 z-0"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadKakaoMap } from '@/utils/loadKakaoMap'
import { getFestivals } from '@/apis/festivalApi'

const route = useRoute()
const mapContainer = ref<HTMLDivElement | null>(null)
let mapInstance: any = null // 지도를 다른 메서드에서도 제어할 수 있도록 변수로 저장

const emit = defineEmits<{
  (e: 'loadedFestivals', festivals: any[]): void
  (e: 'selectFestival', festival: any): void
}>()

// 배열에서 무작위 아이템을 가져오는 셔플 함수
const getRandomItems = (list: any[], count: number) => {
  const shuffled = [...list]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// 외부(부모)에서 사이드바 아이템 클릭 시 지도를 이동시키기 위한 함수
const moveToAddress = (address: string) => {
  if (!address || !mapInstance) return

  const geocoder = new window.kakao.maps.services.Geocoder()
  geocoder.addressSearch(address, (result: any, status: any) => {
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
    
    // 부드럽게 해당 좌표로 지도 중심 이동
    mapInstance.panTo(coords)
  })
}

// 부모 컴포넌트에서 이 함수를 호출할 수 있도록 노출
defineExpose({
  moveToAddress,
})

// 주소를 기반으로 지도에 마커와 커스텀 오버레이를 생성하는 함수
const createMarker = (
  map: any,
  festival: {
    content_id?: string | number
    title: string
    address: string
    image: string
  },
  moveCenter = false,
) => {
  if (!festival.address) return

  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.addressSearch(festival.address, (result: any, status: any) => {
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

    if (moveCenter) {
      map.setCenter(coords)
    }

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      map,
      position: coords,
    })

    // 커스텀 오버레이에 들어갈 HTML 태그 스트링
    const content = `
      <div style="
        width:288px;
        overflow:hidden;
        border-radius:24px;
        background:#fff;
        box-shadow:0 10px 30px rgba(0,0,0,.18);
        border:1px solid #e5e7eb;
      ">
        <img
          src="${festival.image || 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80'}"
          style="
            width:100%;
            height:176px;
            object-fit:cover;
            display:block;
          "
        />
        <div style="padding:20px">
          <div style="
            display:inline-block;
            padding:4px 12px;
            border-radius:999px;
            background:#eef2ff;
            color:#4f46e5;
            font-size:12px;
            font-weight:bold;
          ">
            #축제
          </div>
          <div style="
            margin-top:12px;
            font-size:18px;
            font-weight:800;
            color:#1e293b;
          ">
            ${festival.title}
          </div>
          <div style="
            margin-top:8px;
            font-size:14px;
            color:#64748b;
          ">
            ${festival.address}
          </div>
        </div>
      </div>
    `

    const overlay = new window.kakao.maps.CustomOverlay({
      content,
      position: coords,
      yAnchor: 1.25,
      xAnchor: 0.5,
    })

    // 마우스 오버 시 오버레이 노출
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      overlay.setMap(map)
    })

    // 마우스 아웃 시 오버레이 숨김
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      overlay.setMap(null)
    })

    // 마커 클릭 시 선택 이벤트 emit
    window.kakao.maps.event.addListener(marker, 'click', () => {
      emit('selectFestival', festival)
    })
  })
}

onMounted(async () => {
  await loadKakaoMap()

  if (!mapContainer.value) return

  // 기본 지도 생성 및 인스턴스 저장
  mapInstance = new window.kakao.maps.Map(mapContainer.value, {
    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
    level: 5,
  })

  const title = route.query.title as string
  const address = route.query.address as string
  const image = route.query.image as string
  const contentId = route.query.contentId as string

  // ==========================================
  // CASE 1: 다른 페이지(HotPlace 등)에서 쿼리를 들고 진입한 경우
  // ==========================================
  if (address || contentId) {
    const selectedFestival = {
      content_id: contentId || 'selected-hotplace',
      title: title,
      addr1: address,
      first_image:
        image ||
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80',
      image:
        image ||
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80',
      address,
    }

    emit('loadedFestivals', [selectedFestival])
    
    // 진입하자마자 상세 정보를 바로 보여주기 위해 부모에게 선택 이벤트도 emit 해줍니다.
    emit('selectFestival', selectedFestival)

    createMarker(
      mapInstance,
      {
        content_id: selectedFestival.content_id,
        title,
        address,
        image: selectedFestival.image,
      },
      true,
    )
    
    return
  }

  // ==========================================
  // CASE 2: 네비게이션 바를 통해 그냥 Tour 페이지로 처음 진입한 경우
  // ==========================================
  const response = await getFestivals()
  const rawData = Array.isArray(response.data) ? response.data : response.data.data
  const randomFestivals = getRandomItems(rawData, 8)

  emit('loadedFestivals', randomFestivals)

  randomFestivals.forEach((festival) => {
    createMarker(mapInstance, {
      content_id: festival.content_id,
      title: festival.title,
      address: festival.addr1,
      image:
        festival.first_image ||
        festival.firstimage ||
        festival.first_image2 ||
        festival.firstimage2 ||
        '',
    })
  })
})
</script>