<template>
  <div class="relative h-screen">
    <SideBar :festivals="festivals" @selectFestival="selectedFestival = $event" />

    <KakaoMap @loadedFestivals="festivals = $event" @selectFestival="selectedFestival = $event" />

    <FestivalCard v-if="selectedFestival" :festival="selectedFestival" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KakaoMap from './components/KakaoMap.vue'
import FestivalCard from '@/pages/home/components/FestivalCard.vue'
import SideBar from './components/SideBar.vue'

const festivals = ref<any[]>([])
const selectedFestival = ref<any>(null)
</script>
