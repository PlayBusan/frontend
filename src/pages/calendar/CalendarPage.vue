<!-- src/views/Calendar.vue -->
<template>
  <div
    class="relative min-h-screen bg-gradient-to-b from-secondary/10 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
  >
    <!-- 메인 백그라운드 블러 효과 -->
    <!-- <div class="absolute left-10 top-20 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />
    <div class="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-blue-300/15 blur-3xl" /> -->

    <div class="relative z-10 mx-auto max-w-7xl">
      <!-- 페이지 헤더 -->
      <div class="mb-8 text-center md:text-left">
        <span
          class="inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-primary"
        >
          Festival & Events
        </span>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
          부산 행사 캘린더
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          이번 달 부산에서 즐길 수 있는 축제와 행사 일정을 한눈에 확인하세요.
        </p>
      </div>

      <!-- [수정] items-start를 적용하여 패널이 캘린더 높이에 맞춰 억지로 늘어나지 않고 각자 독립된 자연스러운 높이를 갖게 함 -->
      <div class="flex flex-col-reverse lg:flex-row items-start gap-8">
        <!-- [왼쪽 패널] 폭 w-72 유지, 캘린더보다 짧거나 자연스러운 고유 높이(h-auto) 유지 -->
        <aside class="w-full lg:w-72 flex flex-col h-auto shrink-0">
          <div
            class="rounded-3xl border border-primary/20 p-6 text-slate-800 flex flex-col justify-between shadow-[0_8px_32px_rgba(6,182,212,0.04)] backdrop-blur-[1px] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(6,182,212,0.08)] bg-white/20"
          >
            <div>
              <!-- 상단 배지 -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold tracking-wider text-primary">UPCOMING</span>
              </div>

              <!-- 동적 월별 타이틀 -->
              <h3 class="mt-3 text-2xl font-black text-slate-900 tracking-tight">
                {{ currentMonthText }} 행사
              </h3>

              <!-- 리스트 영역 -->
              <div class="mt-5 border-t border-primary/30 pt-5">
                <ul class="space-y-2">
                  <li
                    v-for="(e, i) in sideEvents"
                    :key="i"
                    class="group relative flex items-start gap-3 rounded-2xl p-3 transition-all duration-200 hover:bg-secondary/20"
                  >
                    <span class="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"></span>
                    <div>
                      <div
                        class="font-bold text-slate-800 group-hover:text-primary transition-colors duration-150"
                      >
                        {{ e.title }}
                      </div>
                      <div class="mt-0.5 text-xs text-slate-400 font-medium">{{ e.period }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- 하단 원문 보기 버튼 -->
            <div class="mt-8">
              <button
                class="w-full rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 p-2 text-white shadow-md transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                행사 원문 보기
              </button>
            </div>
          </div>
        </aside>

        <!-- [오른쪽 캘린더] 메인 바디 영역 (부모 높이 제한 해제하여 자체 스크롤 완전 제거) -->
        <div
          class="flex-1 w-full rounded-3xl border border-primary/20 p-6 shadow-xl shadow-slate-100/30 backdrop-blur-md flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/30 bg-white/70"
        >
          <FullCalendar class="w-full" :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

import { ref, computed } from 'vue'

const sideEvents = [
  { title: '부산 바다축제', period: '07.01 — 07.03' },
  { title: '나이트 뮤직 페스타', period: '07.07 — 07.08' },
  { title: '비프광장 야시장', period: '07.12 — 07.16' },
  { title: '광안리 드론쇼', period: '07.15 — 07.15' },
]

const currentYearMonth = ref({ year: 2026, month: 7 })

const currentMonthText = computed(() => {
  return `${currentYearMonth.value.month}월`
})

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: '',
    center: 'prev title next',
    right: '',
  },
  datesSet: (arg: any) => {
    const currentActiveDate = arg.view.currentStart
    currentYearMonth.value = {
      year: currentActiveDate.getFullYear(),
      month: currentActiveDate.getMonth() + 1,
    }
  },
  events: [
    { title: '부산 바다축제', start: '2026-07-01', end: '2026-07-03' },
    { title: '나이트 뮤직 페스타', start: '2026-07-07', end: '2026-07-08' },
    { title: '비프광장 야시장', start: '2026-07-12', end: '2026-07-16' },
    { title: '광안리 드론쇼', start: '2026-07-15', end: '2026-07-15' },
  ],
  dayMaxEventRows: true,
  // [수정] 고정 높이 비율 대신 'auto'를 부여해 달력 셀 크기와 여백에 맞춰 전체 높이가 유동적으로 확장되도록 변경
  height: 'auto',
})
</script>

<style scoped>
/* FullCalendar 커스텀 테마 스타일링 */

/* 헤더 레이아웃 (센터 집중형) */
::v-deep(.fc-header-toolbar) {
  margin-bottom: 1.5rem !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* 타이틀과 양옆 버튼 간 여백 및 정렬 고도화 */
::v-deep(.fc-header-toolbar .fc-toolbar-chunk) {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
}

::v-deep(.fc .fc-toolbar-title) {
  font-weight: 800;
  font-size: 1.5rem;
  color: #1e293b;
}

/* 타이틀 양옆 화살표 버튼 스타일링 */
::v-deep(.fc-button) {
  background-color: transparent !important;
  border: none !important;
  color: #64748b !important;
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease;
  box-shadow: none !important;
}

::v-deep(.fc-button:hover) {
  background-color: #f1f5f9 !important;
  color: #0f172a !important;
}

::v-deep(.fc-button-active),
::v-deep(.fc-button:focus) {
  background-color: #e2e8f0 !important;
  box-shadow: none !important;
}

/* 요일 헤더 커스텀 */
::v-deep(.fc-col-header-cell-cushion) {
  font-weight: 700;
  color: #64748b;
  font-size: 0.875rem;
  text-decoration: none !important;
  padding-bottom: 8px !important;
}

/* 날짜 번호 커스텀 */
::v-deep(.fc-daygrid-day-top) {
  padding: 8px 10px;
}

::v-deep(.fc-daygrid-day-number) {
  color: #64748b;
  font-weight: 500;
  font-size: 0.85rem;
  text-decoration: none !important;
}

/* 캘린더 내부 가느다란 보더로 변경 */
::v-deep(.fc-theme-standard td, .fc-theme-standard th) {
  border-color: #f8fafc !important;
}

/* 오늘 날짜 표시 커스텀 */
::v-deep(.fc-day-today) {
  background: rgba(6, 182, 212, 0.03) !important;
}

::v-deep(.fc-day-today .fc-daygrid-day-number) {
  color: var(--color-primary) !important;
  font-weight: 800;
}

/* 일정 이벤트 태그 글씨 색상 및 스타일 개선 */
::v-deep(.fc .fc-daygrid-event) {
  /* secondary 색상에 투명도 30%를 적용 (나머지 70%는 투명 투사) */
  background: color-mix(in srgb, var(--color-secondary) 20%, transparent) !important;
  border-left: 3px solid var(--color-primary) !important; /* 청량한 데코 선 */
  border-right: none !important;
  border-top: none !important;
  border-bottom: none !important;
  padding: 5px 8px;
  border-radius: 6px;
  margin-top: 3px !important;
  margin-bottom: 3px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.01);
  transition: all 0.2s ease;
}

::v-deep(.fc .fc-daygrid-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
  background: color-mix(in srgb, var(--color-secondary) 30%, transparent) !important;
}

/* 캘린더 내부 프레임 라운딩 처리 */
::v-deep(.fc-scrollgrid) {
  border-radius: 16px !important;
  border-color: #f1f5f9 !important;
  overflow: hidden;
}

::v-deep(.fc .fc-daygrid-event .fc-event-main),
::v-deep(.fc .fc-daygrid-event .fc-event-title),
::v-deep(.fc .fc-daygrid-event .fc-event-time) {
  color: #000000 !important;
  font-weight: 600 !important; /* 가독성을 위해 굵기도 살짝 강조 */
  font-size: 0.75rem;
}
</style>
