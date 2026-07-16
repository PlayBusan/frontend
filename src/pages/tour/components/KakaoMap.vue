<template>
  <div ref="mapContainer" class="w-full h-screen rounded-xl"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { loadKakaoMap } from '@/utils/loadKakaoMap'
import { getFestivals } from '@/apis/festivalApi'

const route = useRoute()
const mapContainer = ref<HTMLDivElement | null>(null)

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

// 주소를 기반으로 지도에 마커와 커스텀 오버레이를 생성하는 함수
const createMarker = (
  map: any,
  festival: {
    title: string
    address: string
    image: string
  },
  moveCenter = false,
) => {
  // 예외 처리: 주소 값이 없거나 빈 문자열이면 카카오 API를 호출하지 않고 종료 (400 에러 방지)
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
  })
}

onMounted(async () => {
  await loadKakaoMap()

  if (!mapContainer.value) return

  // 기본 지도 생성 (기본 중심 좌표: 부산시청)
  const map = new window.kakao.maps.Map(mapContainer.value, {
    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
    level: 5,
  })

  const title = route.query.title as string
  const address = route.query.address as string
  const image = route.query.image as string

  // ==========================================
  // CASE 1: 다른 페이지(HotPlace 등)에서 쿼리를 들고 온 경우
  // ==========================================
  if (address) {
    createMarker(
      map,
      {
        title,
        address,
        image,
      },
      true, // 해당 위치로 지도 중심 이동
    )
    return // 단일 핀만 보여주고 로직 종료
  }

  // ==========================================
  // CASE 2: 네비게이션 바를 통해 그냥 Tour 페이지로 처음 진입한 경우
  // ==========================================
  const response = await getFestivals()
  const rawData = Array.isArray(response.data) ? response.data : response.data.data

  // 랜덤으로 8개 선택
  const randomFestivals = getRandomItems(rawData, 8)

  // 부모 컴포넌트(Sidebar)로 데이터 송신
  emit('loadedFestivals', randomFestivals)

  // 사이드바에 표시될 8개의 축제 정보를 바탕으로 지도에 각각 마커 생성
  randomFestivals.forEach((festival) => {
    createMarker(map, {
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