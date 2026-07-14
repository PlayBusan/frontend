<template>
  <div class="bg-slate-50">
    <Header />

    <main class="mx-auto max-w-7xl px-4 pt-15 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Floating chatbot button -->
    <button
      aria-label="Open chat"
      @click="openChat"
      class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-900 shadow-lg transition hover:scale-105"
    >
      💬
    </button>

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