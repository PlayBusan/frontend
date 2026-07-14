<template>
  <div class="bg-slate-50">
    <Header />

    <main class="mx-auto max-w-7xl px-4 pt-15 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Floating chatbot button with tooltip -->
    <div class="fixed bottom-6 right-6 z-50">
      <div class="group relative">
        <button
          aria-label="Open chat"
          @click="openChat"
          class="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-900 shadow-lg transition-transform duration-150 hover:scale-105"
        >
          💬
        </button>

        <span class="pointer-events-none absolute right-full bottom-1/2 mr-3 hidden translate-y-1/2 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-all duration-150 group-hover:block group-hover:opacity-100">
          AI 도우미
        </span>
      </div>
    </div>

    <Chatbot v-if="showChat" @close="closeChat" />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
import Chatbot from '@/components/Chatbot.vue'
import { ref } from 'vue'

const showChat = ref(false)
function openChat() {
  showChat.value = true
}
function closeChat() {
  showChat.value = false
}
</script>