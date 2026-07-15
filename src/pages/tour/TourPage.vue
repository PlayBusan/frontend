<template>
  <div class="relative h-screen">
    <KakaoMap @selectFestival="selectedFestival = $event" />

    <FestivalCard v-if="selectedFestival" :festival="selectedFestival" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KakaoMap from './components/KakaoMap.vue'
import FestivalCard from '@/pages/home/components/FestivalCard.vue'

const selectedFestival = ref(null)
</script>
