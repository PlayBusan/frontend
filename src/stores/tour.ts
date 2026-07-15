import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTourStore = defineStore('tour', () => {
  const selectedFestival = ref<{
    title: string
    lat: number
    lng: number
  } | null>(null)

  const selectFestival = (festival: { title: string; lat: number; lng: number }) => {
    selectedFestival.value = festival
  }

  return {
    selectedFestival,
    selectFestival,
  }
})
