<!-- src/views/Home.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-slate-50">
    <!-- 메인 날씨 & 추천 영역 -->
    <section
      class="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden"
    >
      <!-- Background -->
      <div class="absolute left-20 top-32 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div class="absolute right-20 bottom-10 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

      <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl text-slate-800">
          오늘 부산은
          <span class="relative cursor-help font-bold">
            <span class="pb-1"> {{ weatherText }} 날 </span>
            <span class="text-4xl ml-1">
              {{ weatherEmoji }}
            </span>

            <!-- Weather Tooltip -->
            <div
              class="pointer-events-none absolute left-1/2 top-full z-50 mt-5 w-64 -translate-x-1/2 rounded-3xl bg-white/95 p-5 text-left text-base opacity-0 shadow-xl backdrop-blur transition duration-200 group-hover:opacity-100"
            >
              <!-- Arrow -->
              <div class="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />

              <div class="space-y-4 text-slate-700">
                <div>
                  <p class="text-xs text-slate-400">현재 날씨</p>
                  <p class="font-semibold text-slate-800">
                    {{ description }}
                  </p>
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

                  <div class="col-span-2">
                    <p class="text-xs text-slate-400">기압</p>
                    <p class="font-semibold text-slate-800">{{ pressure }} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          </span>
        </h1>

        <h2
          class="mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-5xl font-black text-transparent"
        >
          뭐 하고 놀까?
        </h2>

        <p class="mt-8 text-lg font-medium text-slate-500">
          {{ recommendation }}
        </p>

        <!-- 스크롤 유도 아이콘 -->
        <!-- <div class="mt-12 flex flex-col items-center animate-bounce text-slate-300">
          <span class="text-xs font-semibold tracking-wider text-slate-400 mb-1"
            >추천 명소 둘러보기</span
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div> -->
      </div>
    </section>

    <!-- 하단 실시간 핫플레이스 가로 스크롤 섹션 -->
    <section class="flex flex-col items-center bg-slate-50/50 border-t border-slate-100">
      <HotPlaces />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getCurrentWeather } from '@/apis/weather'
import HotPlaces from './components/HotPlaces.vue'

const weather = ref<any>(null)

onMounted(async () => {
  const res = await getCurrentWeather()
  weather.value = res.data
})

const temp = computed(() => (weather.value ? Math.round(weather.value.main.temp) : '--'))

const feelsLike = computed(() => (weather.value ? Math.round(weather.value.main.feels_like) : '--'))

const humidity = computed(() => (weather.value ? weather.value.main.humidity : '--'))

const pressure = computed(() => (weather.value ? weather.value.main.pressure : '--'))

const wind = computed(() => (weather.value ? weather.value.wind.speed : '--'))

const description = computed(() => (weather.value ? weather.value.weather[0].description : ''))

const iconUrl = computed(() =>
  weather.value ? `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@2x.png` : '',
)

const weatherText = computed(() => {
  if (!weather.value) return ''

  const main = weather.value.weather[0].main

  switch (main) {
    case 'Clear':
      return '맑은'

    case 'Clouds':
      return '구름이 조금 낀'

    case 'Rain':
      return '비가 오는'

    case 'Snow':
      return '눈이 내리는'

    case 'Thunderstorm':
      return '천둥이 치는'

    default:
      return description.value
  }
})

const weatherEmoji = computed(() => {
  if (!weather.value) return ''

  const main = weather.value.weather[0].main

  switch (main) {
    case 'Clear':
      return '☀️'

    case 'Clouds':
      return '🌥️'

    case 'Rain':
      return '🌧️'

    case 'Snow':
      return '❄️'

    case 'Thunderstorm':
      return '⛈️'

    default:
      return '🌈'
  }
})

const recommendation = computed(() => {
  if (!weather.value) return ''

  const temp = weather.value.main.temp

  if (temp >= 30) return '시원한 실내 전시나 카페에 가기 좋은 날이에요.'

  if (temp >= 24) return '해운대나 광안리 산책하기 딱 좋은 날씨예요.'

  if (temp >= 18) return '가볍게 부산 골목을 걸어보기 좋은 날이에요.'

  return '따뜻하게 입고 부산을 둘러보세요.'
})
</script>
