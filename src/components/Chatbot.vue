<template>
  <div class="fixed inset-0 z-50 flex items-end justify-end">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>

    <transition name="slide-up">
      <div class="m-6 w-80 rounded-[18px] bg-white shadow-2xl z-50">
        <header class="flex items-start justify-between gap-3 rounded-t-[18px] bg-white px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">🤖</div>
          <div>
            <div class="text-sm font-semibold text-slate-900">부산 AI 도우미</div>
            <div class="mt-1 text-xs text-slate-500">행사 · 장소 · 동네 팁</div>
          </div>
        </div>

        <button @click="$emit('close')" aria-label="Close chat" class="text-slate-400 hover:text-slate-600">✕</button>
      </header>

      <div class="p-4">
        <div class="mb-3 rounded-lg bg-sky-50/80 p-3 text-sm text-slate-800">안녕하세요 부산 행사와 동네 정보를 찾아드릴게요. 무엇이 궁금하세요?</div>

        <div class="chat-area h-52 overflow-auto rounded-md bg-white">
          <div v-for="(m, i) in messages" :key="i" class="px-3 py-2">
            <div v-if="m.from === 'bot'" class="inline-block max-w-full rounded-2xl bg-sky-50 px-3 py-2 text-sm text-slate-800">{{ m.text }}</div>
            <div v-else class="ml-auto inline-block max-w-full rounded-2xl bg-slate-200 px-3 py-2 text-sm text-slate-900">{{ m.text }}</div>
          </div>
        </div>

        <div class="mt-3">
          <div class="flex items-center gap-2">
            <input ref="inputEl" v-model="input" @keydown.enter="send" placeholder="궁금한 내용을 입력하세요" class="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none" />
            <button @click="send" class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-white shadow">➡️</button>
          </div>
        </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
const input = ref('')
const inputEl = ref<HTMLInputElement | null>(null)
const messages = ref<Array<{ from: string; text: string }>>([])

onMounted(() => {
  nextTick(() => {
    inputEl.value?.focus()
  })
})

function send() {
  if (!input.value) return
  messages.value.push({ from: 'user', text: input.value })
  // simple bot echo response for now
  const userText = input.value
  input.value = ''
  setTimeout(() => {
    messages.value.push({ from: 'bot', text: `질문하신 내용: "${userText}" 를 확인했어요. 관련 정보를 찾아볼게요.` })
  }, 600)
}
</script>

<style scoped>
.chat-area::-webkit-scrollbar { height: 8px; }
.chat-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 999px; }
.shadow-2xl { box-shadow: 0 20px 50px rgba(2,6,23,0.12); }

/* Slide-up transition */
.slide-up-enter-from {
  transform: translateY(18px);
  opacity: 0;
}
.slide-up-enter-active {
  transition: transform 220ms cubic-bezier(.22,.9,.35,1), opacity 220ms ease;
}
.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-up-leave-active {
  transition: transform 160ms ease, opacity 160ms ease;
}
.slide-up-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>
