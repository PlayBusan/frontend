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

const getRandomItems = (list: any[], count: number) => {
  const shuffled = [...list]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

const createMarker = (
  map: any,
  festival: {
    title: string
    address: string
    image: string
  },
  moveCenter = false,
) => {
  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.addressSearch(festival.address, (result: any, status: any) => {
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

    if (moveCenter) {
      map.setCenter(coords)
    }

    const marker = new window.kakao.maps.Marker({
      map,
      position: coords,
    })

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
          src="${festival.image}"
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

    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      overlay.setMap(map)
    })

    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      overlay.setMap(null)
    })
  })
}

onMounted(async () => {
  await loadKakaoMap()

  if (!mapContainer.value) return

  const map = new window.kakao.maps.Map(mapContainer.value, {
    center: new window.kakao.maps.LatLng(35.1795543, 129.0756416),
    level: 5,
  })
  const title = route.query.title as string
  const address = route.query.address as string
  const image = route.query.image as string

  // =========================
  // HotPlace에서 넘어온 경우
  // =========================
  if (address) {
    createMarker(
      map,
      {
        title,
        address,
        image,
      },
      true,
    )

    return
  }

  // =========================
  // 그냥 Tour 페이지 접속
  // =========================
  const response = await getFestivals()

  const rawData = Array.isArray(response.data) ? response.data : response.data.data

  const randomFestivals = getRandomItems(rawData, 8)

  randomFestivals.forEach((festival: any) => {
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

  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.addressSearch(address, (result: any, status: any) => {
    if (status !== window.kakao.maps.services.Status.OK) return

    const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))

    map.setCenter(coords)

    const marker = new window.kakao.maps.Marker({
      map,
      position: coords,
    })

    // 카드 HTML
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
          src="${image}"
          style="
            width:100%;
            height:176px;
            object-fit:cover;
            display:block;
          "
          onerror="this.src='https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80'"
        />

        <div style="padding:20px">
          <div
            style="
              display:inline-block;
              padding:4px 12px;
              border-radius:999px;
              background:#eef2ff;
              color:#4f46e5;
              font-size:12px;
              font-weight:bold;
            "
          >
            #축제
          </div>

          <div
            style="
              margin-top:12px;
              font-size:18px;
              font-weight:800;
              color:#1e293b;
            "
          >
            ${title}
          </div>

          <div
            style="
              margin-top:8px;
              color:#64748b;
              font-size:14px;
            "
          >
            ${address}
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

    // 마우스 올리면 카드
    window.kakao.maps.event.addListener(marker, 'mouseover', () => {
      overlay.setMap(map)
    })

    // 마우스 떼면 카드 숨김
    window.kakao.maps.event.addListener(marker, 'mouseout', () => {
      overlay.setMap(null)
    })
  })
})
</script>
