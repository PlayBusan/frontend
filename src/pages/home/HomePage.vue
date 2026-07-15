<template>
  <div class="min-h-screen bg-gradient-to-b from-secondary/10 via-white to-slate-50">
    <!-- 메인 날씨 & 추천 영역 -->
    <section
      class="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden bg-cover bg-center transition-all duration-1000 ease-in-out"
      :style="{ backgroundImage: `url(${activeImage})` }"
    >
      <!-- 가독성을 위한 어두운 오버레이 -->
      <div class="absolute inset-0 bg-black/40" />

      <div class="relative z-10 text-center px-4">
        <!-- 로딩 전후 처리 -->
        <h1 class="text-4xl text-white">
          오늘 부산은
          <span
            v-if="weather"
            class="relative cursor-help font-bold group inline-flex items-center"
          >
            <span class="pb-1"> {{ weatherText }} 날 </span>
            <span class="text-4xl ml-1"> {{ weatherEmoji }} </span>

            <!-- Weather Tooltip -->
            <div
              class="pointer-events-none absolute left-1/2 top-full z-50 mt-5 w-64 -translate-x-1/2 rounded-3xl bg-white/95 p-5 text-left text-base opacity-0 shadow-xl backdrop-blur transition duration-200 group-hover:opacity-100"
            >
              <div class="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
              <div class="space-y-4 text-slate-700">
                <div>
                  <p class="text-xs text-slate-400">현재 날씨</p>
                  <p class="font-semibold text-slate-800">{{ description }}</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-slate-400">기온</p>
                    <p class="font-semibold text-slate-800">{{ temp }}°</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400">체감온도</p>
                    <p class="font-semibold text-slate-800">{{ feelsLike }}°</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400">습도</p>
                    <p class="font-semibold text-slate-800">{{ humidity }}%</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-400">풍속</p>
                    <p class="font-semibold text-slate-800">{{ wind }} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          </span>
          <span v-else class="ml-2 animate-pulse">날씨 정보 불러오는 중...</span>
        </h1>

        <h2 class="mt-3 text-5xl font-black text-white drop-shadow-md">뭐 하고 놀까?</h2>

        <p class="mt-8 text-lg font-medium text-slate-100 drop-shadow-sm">
          {{ recommendation }}
        </p>
      </div>
    </section>

    <!-- 하단 실시간 핫플레이스 섹션 -->
    <section class="flex flex-col items-center bg-slate-50/50 border-t border-slate-100">
      <HotPlaces />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getCurrentWeather } from '@/apis/weather'
import HotPlaces from './components/HotPlaces.vue'

// 이미지 임포트
import img1 from '@/assets/busan_city.jpg'
import img2 from '@/assets/busan_night_view.jpg'
import img3 from '@/assets/culture_village.jpg'
import img4 from '@/assets/busan_beach.webp'

const images = [img1, img2, img3, img4]
const currentImageIndex = ref(0)
let intervalId: ReturnType<typeof setInterval>

const weather = ref<any>(null)

onMounted(async () => {
  // 이미지 슬라이드 인터벌 (5초)
  intervalId = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length
  }, 2000)

  try {
    const res = await getCurrentWeather()
    weather.value = res.data
  } catch (error) {
    console.error('날씨 정보를 가져오는데 실패했습니다.', error)
  }
})

onUnmounted(() => {
  clearInterval(intervalId)
})

const activeImage = computed(() => images[currentImageIndex.value])

// 날씨 데이터 계산
const temp = computed(() => (weather.value ? Math.round(weather.value.main.temp) : '--'))
const feelsLike = computed(() => (weather.value ? Math.round(weather.value.main.feels_like) : '--'))
const humidity = computed(() => (weather.value ? weather.value.main.humidity : '--'))
const wind = computed(() => (weather.value ? weather.value.wind.speed : '--'))
const description = computed(() => (weather.value ? weather.value.weather[0].description : ''))

const weatherText = computed(() => {
  if (!weather.value) return ''
  const main = weather.value.weather[0].main
  const map: Record<string, string> = {
    Clear: '맑은',
    Clouds: '구름이 조금 낀',
    Rain: '비가 오는',
    Snow: '눈이 내리는',
    Thunderstorm: '천둥이 치는',
  }
  return map[main] || description.value
})

const weatherEmoji = computed(() => {
  if (!weather.value) return ''
  const main = weather.value.weather[0].main
  const map: Record<string, string> = {
    Clear: '☀️',
    Clouds: '🌥️',
    Rain: '🌧️',
    Snow: '❄️',
    Thunderstorm: '⛈️',
  }
  return map[main] || '🌈'
})

const recommendation = computed(() => {
  if (!weather.value) return 'PLAY BUSAN과 함께해보세요.'
  const tempVal = weather.value.main.temp
  if (tempVal >= 30) return '시원한 실내 전시나 카페에 가기 좋은 날이에요.'
  if (tempVal >= 24) return '해운대나 광안리 산책하기 딱 좋은 날씨예요.'
  if (tempVal >= 18) return '가볍게 부산 골목을 걸어보기 좋은 날이에요.'
  return '따뜻하게 입고 부산을 둘러보세요.'
})
</script>
