<template>
  <div class="bg-slate-50">
    <Header />

    <main class="pt-15">
      <slot />
    </main>

    <!-- Floating chatbot button -->
    <div class="fixed bottom-6 right-6 z-50">
      <div class="group relative">
        <button
          aria-label="Open chat"
          class="flex flex-col gap-0.5 p-3 w-16 h-16 bg-white border-primary items-center justify-center rounded-full shadow-lg transition-transform duration-150 hover:scale-105"
          @click="openChat"
        >
          <img :src="chatbotIcon" alt="AI 도우미" class="h-6 w-6 object-contain" />
          <span class="text-xs font-semibold">챗봇</span>
        </button>
        <span
          class="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          AI 도우미
        </span>
      </div>
    </div>

    <Chatbot v-if="showChat" @close="closeChat" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Header from '@/components/layout/Header.vue'
import Chatbot from '@/components/Chatbot.vue'
import chatbotIcon from '@/assets/chatbot-icon.png'

const showChat = ref(false)

const openChat = () => {
  showChat.value = true
}

const closeChat = () => {
  showChat.value = false
}
</script>
