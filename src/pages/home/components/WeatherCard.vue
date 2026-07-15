<template>
  <article
    class="bg-gradient-to-r from-cyan-500 to-blue-600 relative flex min-h-[160px] flex-col justify-between overflow-hidden rounded-3xl p-6 text-white shadow-xl"
  >
    <div class="flex items-start justify-between">
      <div>
        <span
          class="inline-flex items-center rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300 backdrop-blur-sm"
        >
          LIVE BUSAN
        </span>

        <h2 class="mt-3 text-2xl font-bold tracking-tight">지금 실시간 부산 날씨</h2>
      </div>

      <div class="text-right">
        <span class="text-4xl">🌤️</span>

        <p class="mt-1 text-xs text-cyan-200/80">구름 조금</p>
      </div>
    </div>

    <div class="mt-6 flex items-baseline gap-4">
      <span class="text-5xl font-black tracking-tighter"> 28°C </span>

      <div class="space-y-0.5 border-l border-cyan-500/30 pl-4 text-xs text-cyan-100/70">
        <p>습도: 65%</p>
        <p>강수확률: 10%</p>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { getCurrentWeather } from '@/apis/weather'

onMounted(async () => {
  const res = await getCurrentWeather()
})
</script>
