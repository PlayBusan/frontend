<!-- src/components/HotPlaces.vue -->
<template>
  <div class="w-full max-w-7xl px-6 py-12">
    <div class="mb-6 flex items-end justify-between">
      <div>
        <p class="text-xs font-semibold text-primary/80 uppercase tracking-wider">
          실시간 핫플레이스
        </p>
        <h3 class="mt-1 text-2xl font-bold text-slate-800">지금 핫한 부산 명소</h3>
      </div>
      <button class="text-sm font-medium text-slate-400 hover:text-indigo-600 transition-colors">
        전체보기 &rarr;
      </button>
    </div>

    <!-- 가로 드래그/스크롤 영역 -->
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
      <!-- 로딩 상태 처리 -->
      <div v-if="loading" class="w-full py-12 text-center text-sm font-medium text-slate-400">
        핫플레이스를 불러오는 중입니다...
      </div>

      <!-- 개별 플레이스 카드 (가공된 중복 리스트 루프) -->
      <div
        v-else
        v-for="(place, index) in hotPlacesDuplicated"
        :key="`${place.id}-${index}`"
        class="w-72 shrink-0 overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
      >
        <!-- 이미지 영역 -->
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

        <!-- 콘텐츠 영역 -->
        <div class="p-5">
          <!-- 샵(#) 형태의 깔끔한 태그 적용 -->
          <div class="mb-3 inline-flex items-center rounded-full bg-secondary/20 px-3 py-1">
            <span class="text-xs font-bold text-primary"> #{{ place.type }} </span>
          </div>

          <h4 class="text-lg font-black text-slate-800 truncate">
            {{ place.name }}
          </h4>

          <p class="text-sm text-gray-600">{{ place.addr1 }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// TypeScript 인터페이스 정의 (icon 제거)
interface Place {
  id: number
  name: string
  imageUrl: string
  type: string
  addr1: string
  addr2: string
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
 * API에서 가져온 다양한 형태의 데이터를 안전하게 걸러내는 분별기(Parser) 함수 (아이콘 반환 제거)
 */
const getPlaceType = (item: any) => {
  const code = item.lclsSystm3 || ''

  if (code.startsWith('NA02')) return { type: '바다' }
  if (code.startsWith('VE01')) return { type: '전망' }
  if (code.startsWith('VE02')) return { type: '체험' }
  if (code.startsWith('VE03')) return { type: '공원' }
  if (code.startsWith('VE04')) return { type: '문화' }
  if (code.startsWith('HS')) return { type: '역사' }
  if (code.startsWith('EX05')) return { type: '힐링' }
  if (code.startsWith('EX07')) return { type: '놀거리' }

  return { type: '관광명소' }
}

const mapRawToPlace = (item: any): Place => {
  const name = item.title || item.name || '부산 명소'

  const imageUrl =
    item.firstimage ||
    item.imageUrl ||
    'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80'

  const { type } = getPlaceType(item)

  return {
    id: Number(item.contentid),
    name,
    imageUrl,
    type,
    addr1: item.addr1 || '부산광역시',
    addr2: item.addr2 || '',
  }
}

// JSON Server 연동 데이터 Fetch
const fetchHotPlaces = async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:5000/items')
    if (!res.ok) throw new Error('네트워크 반응이 원활하지 않습니다.')

    const rawData = await res.json()

    console.log('API 원본 데이터 형태:', rawData)

    if (Array.isArray(rawData)) {
      rawPlaces.value = rawData.map(mapRawToPlace)
    } else {
      rawPlaces.value = []
    }

    if (rawPlaces.value.length > 0) {
      selectedPlaces.value = getRandomPlaces(rawPlaces.value, Math.min(8, rawPlaces.value.length))
      hotPlacesDuplicated.value = [...selectedPlaces.value, ...selectedPlaces.value]
    }

    console.log('선정된 핫플레이스:', selectedPlaces.value)
    setTimeout(() => {
      startAutoScroll()
    }, 100)
  } catch (error) {
    console.error('JSON Server 연동 에러:', error)
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

  await fetchHotPlaces()

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
