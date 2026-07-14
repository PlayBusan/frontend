<template>
  <div class="fixed inset-0 z-50 flex items-end justify-end">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>

    <div class="m-6 w-96 rounded-2xl bg-white shadow-lg">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <h3 class="text-sm font-semibold">챗봇</h3>
        <button @click="$emit('close')" class="text-sm text-slate-500">닫기</button>
      </div>

      <div class="p-4">
        <div class="h-64 overflow-auto text-sm text-slate-700">챗봇 대화 영역 (샘플)</div>
        <div class="mt-3 flex gap-2">
          <input v-model="input" @keydown.enter="send" class="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="메시지를 입력하세요" />
          <button @click="send" class="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">전송</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const input = ref('')
function send() {
  if (!input.value) return
  // Placeholder behavior: show alert for now
  // Replace with API/websocket integration later
  // eslint-disable-next-line no-alert
  alert(`보낼 메시지: ${input.value}`)
  input.value = ''
}
</script>
