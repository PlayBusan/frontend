<!-- src/components/HotPlaces.vue -->
<template>
  <div class="w-full max-w-5xl px-6 py-12">
    <div class="mb-6 flex items-end justify-between">
      <div>
        <p class="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
          실시간 핫플레이스
        </p>
        <h3 class="mt-1 text-2xl font-bold text-slate-800">지금 핫한 부산 명소</h3>
      </div>
      <button class="text-sm font-medium text-slate-400 hover:text-slate-600 transition">
        전체보기 &rarr;
      </button>
    </div>

    <!-- 가로 드래그/스크롤 영역 -->
    <div
      ref="scrollContainer"
      class="flex gap-6 overflow-x-auto pb-4 scroll-smooth cursor-grab active:cursor-grabbing"
      @mousedown="startDragging"
      @mousemove="onDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      :class="{ 'scrollbar-hide': true }"
      style="-ms-overflow-style: none; scrollbar-width: none"
    >
      <!-- 개별 플레이스 카드 -->
      <div
        v-for="place in hotPlacesDuplicated"
        :key="`${place.id}`"
        class="w-72 shrink-0 select-none overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
      >
        <!-- 이미지 영역 -->
        <div class="relative h-44 w-full bg-slate-100">
          <img
            :src="place.imageUrl"
            :alt="place.name"
            class="h-full w-full object-cover pointer-events-none"
          />
          <span
            class="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-bold text-slate-800"
          >
            ★ {{ place.rating }}
          </span>
        </div>

        <!-- 콘텐츠 영역 -->
        <div class="p-5">
          <div class="flex flex-wrap gap-1 mb-2">
            <span
              v-for="tag in place.tags"
              :key="tag"
              class="text-[11px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md"
            >
              #{{ tag }}
            </span>
          </div>
          <h4 class="text-lg font-bold text-slate-800">{{ place.name }}</h4>
          <p class="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {{ place.description }}
          </p>
          <button
            class="mt-4 w-full rounded-2xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-cyan-500 hover:text-white transition duration-200"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const hotPlaces = ref([
  {
    id: 1,
    name: '광안리 해변공원',
    imageUrl:
      'https://images.unsplash.com/photo-1570191845551-729837920da7?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['바다뷰', '산책하기좋은', '야경명소'],
    description:
      '구름 낀 선선한 날씨에 광안대교를 바라보며 해변가 산책길을 걸어보세요. 버스킹 구경은 덤!',
  },
  {
    id: 2,
    name: '영도 흰여울문화마을',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    tags: ['감성카페', '인생샷', '절벽마을'],
    description:
      '바다 절벽을 따라 늘어선 예쁜 골목길과 카페들. 해 질 녘 노을을 배경으로 인생샷을 건져보세요.',
  },
  {
    id: 3,
    name: '해운대 블루라인파크',
    imageUrl:
      'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    tags: ['캡슐열차', '이색체험', '데이트코스'],
    description:
      '동해남부선 옛 철길을 따라 해변 열차와 스카이캡슐을 타고 부산의 푸른 바다를 한눈에 담아보세요.',
  },
  {
    id: 4,
    name: '전포 사잇길 (전리단길)',
    imageUrl:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    tags: ['소품샵투어', '이색맛집', '힙플레이스'],
    description:
      '아기자기한 독립 소품샵들과 힙한 감성의 로스터리 카페가 가득해 골목골목 구경하는 재미가 가득합니다.',
  },
])

const hotPlacesDuplicated = [...hotPlaces.value, ...hotPlaces.value]

const scrollContainer = ref<HTMLDivElement | null>(null)

const isDragging = ref(false)

let startX = 0
let scrollLeft = 0

let autoTimer: number | null = null
let resumeTimer: number | null = null

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

// ---------------- 드래그 ----------------

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

// ---------------- wheel ----------------

const handleWheel = () => {
  stopAutoScroll()
  resumeAutoScroll()
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollLeft = 0
  }

  startAutoScroll()

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
/* 크롬, 사파리, 오페라에서 스크롤바 숨기기 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
