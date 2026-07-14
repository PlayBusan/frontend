<template>
  <div class="mx-auto max-w-7xl">
    <div class="flex items-stretch gap-6 h-[640px]">
        <div class="flex-1 rounded-2xl bg-white p-6 shadow flex flex-col">
          <FullCalendar class="flex-1" :options="calendarOptions" />
        </div>

        <aside class="w-80">
          <div class="rounded-2xl bg-[#0b2b48] p-6 text-white h-full flex flex-col justify-between">
            <div>
              <div class="text-sm font-semibold opacity-80">THIS MONTH</div>
              <h3 class="mt-3 text-lg font-bold">놓치지 마세요</h3>
              <ul class="mt-4 space-y-3 text-sm opacity-90">
                <li v-for="(e, i) in sideEvents" :key="i" class="flex items-start justify-between">
                  <div>
                    <div class="font-medium">{{ e.title }}</div>
                    <div class="text-xs opacity-70">{{ e.period }}</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <button class="mt-4 w-full rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-900">행사 원문 보기</button>
            </div>
          </div>
        </aside>
      </div>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { ref } from 'vue'

const sideEvents = [
  { title: '부산 바다축제', period: '08.01 — 08.03' },
  { title: '나이트 뮤직 페스타', period: '08.07 — 08.08' },
  { title: '비프광장 야시장', period: '08.12 — 08.16' },
  { title: '광안리 드론쇼', period: '08.15 — 08.15' },
]

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: ''
  },
  events: [
    { title: '부산 바다축제', start: '2026-08-01', end: '2026-08-03' },
    { title: '나이트 뮤직 페스타', start: '2026-08-07', end: '2026-08-08' },
    { title: '비프광장 야시장', start: '2026-08-12', end: '2026-08-16' },
    { title: '광안리 드론쇼', start: '2026-08-15', end: '2026-08-15' },
  ],
  dayMaxEventRows: true,
  height: '100%',
})
</script>

<style scoped>
/* Basic FullCalendar tweaks to match the design */
.fc .fc-daygrid-day-top {
  padding: 12px 14px;
}

.fc .fc-toolbar-title {
  font-weight: 700;
  font-size: 1.25rem;
}

.fc .fc-daygrid-event {
  background: rgba(59,130,246,0.12);
  border: none;
  color: #1e293b;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
}

.fc .fc-daygrid-day-frame {
  border-radius: 12px;
}
</style>
