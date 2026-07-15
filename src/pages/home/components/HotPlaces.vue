<template>
  <div class="w-full max-w-7xl px-6 py-12">
    <div class="mb-6 flex items-end justify-between">
      <div>
        <p class="text-xs font-semibold text-primary/80 uppercase tracking-wider">
          실시간 핫플레이스
        </p>
        <h3 class="mt-1 text-2xl font-bold text-slate-800">지금 핫한 부산 축제</h3>
      </div>
      <button class="text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors">
        전체보기 &rarr;
      </button>
    </div>

    <div
      ref="scrollContainer"
      class="flex gap-6 overflow-x-auto pb-4 scroll-smooth cursor-grab active:cursor-grabbing select-none"
      @mousedown="startDragging"
      @mousemove="onDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      :class="{ 'scrollbar-hide': true }"
      style="-ms-overflow-style: none; scrollbar-width: none"
    >
      <div v-if="loading" class="w-full py-12 text-center text-sm font-medium text-slate-400">
        축제 정보를 불러오는 중입니다...
      </div>

      <div
        v-else-if="hotPlacesDuplicated.length === 0"
        class="w-full py-12 text-center text-sm font-medium text-slate-400"
      >
        이번 달에 진행 중이거나 진행 예정인 축제가 없습니다.
      </div>

      <div
        @click="moveToTour(place)"
        v-else
        v-for="(place, index) in hotPlacesDuplicated"
        :key="`${place.id}-${index}`"
        class="w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
      >
        <div class="relative h-44 w-full bg-slate-100">
          <img
            :src="place.imageUrl"
            :alt="place.name"
            class="h-full w-full object-cover pointer-events-none"
            @error="
              (e) => {
                ;(e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80'
              }
            "
          />
        </div>

        <div class="p-5">
          <div class="mb-3 inline-flex items-center rounded-full bg-secondary/20 px-3 py-1">
            <span class="text-xs font-bold text-primary"> #{{ place.type }} </span>
          </div>

          <h4 class="text-lg font-black text-slate-800 truncate" :title="place.name">
            {{ place.name }}
          </h4>

          <p class="text-sm text-gray-600 truncate">{{ place.addr1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getFestivals } from '@/apis/festivalApi'

// TypeScript 인터페이스 정의
interface Place {
  id: number
  name: string
  imageUrl: string
  type: string
  addr1: string
  addr2: string
  startDate: string // "20260426" 형태의 문자열 저장 예정
  endDate: string // "20260426" 형태의 문자열 저장 예정
}

const rawPlaces = ref<Place[]>([])
const selectedPlaces = ref<Place[]>([])
const hotPlacesDuplicated = ref<Place[]>([])
const loading = ref(true)

const scrollContainer = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)

let startX = 0
let scrollLeft = 0

let autoTimer: number | null = null
let resumeTimer: number | null = null

// Fisher-Yates 셔플 알고리즘으로 무작위 8개 추출
const getRandomPlaces = (list: Place[], count: number): Place[] => {
  const shuffled = [...list]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }

  return shuffled.slice(0, count)
}

/**
 * 축제 데이터 분류 분별기
 */
const getPlaceType = (item: any) => {
  const code = item.lcls_systm3 || item.lcls_systm1 || ''

  if (code.startsWith('EV01')) return { type: '축제' }
  if (code.startsWith('EV02') || code.startsWith('EV')) return { type: '행사' }

  return { type: '부산축제' }
}

const isUpcomingFestival = (place: Place): boolean => {
  if (!place.startDate || !place.endDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const start = place.startDate.replace(/\D/g, '')
  const end = place.endDate.replace(/\D/g, '')

  const startDate = new Date(
    Number(start.slice(0, 4)),
    Number(start.slice(4, 6)) - 1,
    Number(start.slice(6, 8)),
  )

  const endDate = new Date(
    Number(end.slice(0, 4)),
    Number(end.slice(4, 6)) - 1,
    Number(end.slice(6, 8)),
    23,
    59,
    59,
  )

  // 진행 중이거나 앞으로 열릴 축제
  return endDate >= today
}

import { useRouter } from 'vue-router'

const router = useRouter()

const moveToTour = (place: Place) => {
  router.push({
    path: '/tour',
    query: {
      title: place.name,
      address: `${place.addr1} ${place.addr2}`,
    },
  })
}

/**
 * 새로운 API의 축제 데이터 규격을 컴포넌트 내부 Place 구조로 맵핑
 */
const mapRawToPlace = (item: any): Place => {
  const { type } = getPlaceType(item)

  return {
    id: Number(item.content_id ?? item.contentid),
    name: item.title ?? '부산 축제',
    imageUrl:
      item.first_image ||
      item.firstimage ||
      item.first_image2 ||
      item.firstimage2 ||
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80',
    type,
    addr1: item.addr1 ?? '부산광역시',
    addr2: item.addr2 ?? '',
    startDate: item.eventstartdate ?? '',
    endDate: item.eventenddate ?? '',
  }
}

// 축제 API 호출 및 가공
const fetchFestivalPlaces = async () => {
  try {
    loading.value = true

    const response = await getFestivals()

    // 배열이든 {data:[]}든 둘 다 대응
    const rawData = Array.isArray(response.data) ? response.data : response.data.data

    if (!Array.isArray(rawData)) {
      rawPlaces.value = []
      hotPlacesDuplicated.value = []
      return
    }

    rawPlaces.value = rawData
      .map(mapRawToPlace)
      .filter(isUpcomingFestival)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))

    // 가장 가까운 축제 8개
    selectedPlaces.value = rawPlaces.value.slice(0, 8)

    hotPlacesDuplicated.value = [...selectedPlaces.value, ...selectedPlaces.value]

    setTimeout(startAutoScroll, 100)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const startAutoScroll = () => {
  stopAutoScroll()

  autoTimer = window.setInterval(() => {
    const el = scrollContainer.value
    if (!el || isDragging.value) return

    el.scrollLeft += 0.6
    const half = el.scrollWidth / 2

    if (el.scrollLeft >= half) {
      el.scrollLeft -= half
    }
    if (el.scrollLeft <= 0) {
      el.scrollLeft += half
    }
  }, 16)
}

const stopAutoScroll = () => {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
}

const resumeAutoScroll = () => {
  if (resumeTimer) clearTimeout(resumeTimer)

  resumeTimer = window.setTimeout(() => {
    startAutoScroll()
  }, 5000)
}

// ---------------- 드래그 컨트롤 ----------------

const startDragging = (e: MouseEvent) => {
  const el = scrollContainer.value
  if (!el) return

  isDragging.value = true
  stopAutoScroll()

  startX = e.pageX - el.offsetLeft
  scrollLeft = el.scrollLeft
}

const onDragging = (e: MouseEvent) => {
  if (!isDragging.value) return

  const el = scrollContainer.value
  if (!el) return

  e.preventDefault()

  const x = e.pageX - el.offsetLeft
  const walk = (x - startX) * 1.4

  el.scrollLeft = scrollLeft - walk
}

const stopDragging = () => {
  if (!isDragging.value) return

  isDragging.value = false
  resumeAutoScroll()
}

const handleWheel = () => {
  stopAutoScroll()
  resumeAutoScroll()
}

onMounted(async () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = 0
  }

  // 컴포넌트 마운트 시 축제 API 실행
  await fetchFestivalPlaces()

  scrollContainer.value?.addEventListener('wheel', handleWheel, {
    passive: true,
  })

  scrollContainer.value?.addEventListener('touchmove', handleWheel, {
    passive: true,
  })
})

onBeforeUnmount(() => {
  stopAutoScroll()

  if (resumeTimer) clearTimeout(resumeTimer)

  scrollContainer.value?.removeEventListener('wheel', handleWheel)
  scrollContainer.value?.removeEventListener('touchmove', handleWheel)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
