<template>
  <main class="bg-slate-50/50 pt-15">
    <section class="mx-auto flex max-w-6xl flex-col items-center gap-12 py-8">
      <!-- Hero -->
      <div class="text-center grid gap-4">
        <h1
          class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
        >
          오늘 부산,
          <span
            class="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"
          >
            뭐 하고 놀까?
          </span>
        </h1>

        <p class="mt-5 text-slate-600">
          부산 사람들의 진짜 이야기와 지금 열리는 행사까지.
          우리 동네의 좋은 순간을 가볍게 나눠요.
        </p>
      </div>

      <!-- Dashboard -->
      <section
        class="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-12"
      >
        <!-- Left -->
        <section class="flex flex-col gap-6 lg:col-span-7">
          <!-- Weather -->
          <WeatherCard />

          <!-- Community -->
         <CommunityCard :posts="posts" />
        </section>

        <!-- Right -->
        <aside class="flex flex-col gap-6 lg:col-span-5">
          <FestivalCard :events="events" />
        </aside>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import WeatherCard from './components/WeatherCard.vue'
import CommunityCard from './components/CommunityCard.vue'
import FestivalCard from './components/FestivalCard.vue'

</script>