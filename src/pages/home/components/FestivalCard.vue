<template>
  <article
            class="flex  flex-col rounded-3xl border border-slate-100 bg-blue-100 p-6 shadow-sm"
          >
            <header class="flex items-center justify-between mb-2">
              <div>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider text-cyan-600"
                >
                  EVENT
                </span>

                <h2 class="text-lg font-bold text-slate-900 mb-1">
                  실시간 인기 행사
                </h2>
              </div>

              <button
                class="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                행사 더 보기 ›
              </button>
            </header>

            <ul class="mt-6 grid gap-2">
              <li
                v-for="(e, i) in events"
                :key="i"
              >
                <article
                  class="flex items-center justify-between rounded-xl bg-white px-3 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <h3 class="text-sm font-semibold text-slate-800">
                      {{ e.title }}
                    </h3>

                    <p class="mt-1 text-xs text-slate-400">
                      {{ e.period }}
                    </p>
                  </div>

                  <span
                    :class="[
                      e.tag === '진행 중'
                        ? 'border-cyan-100 bg-cyan-50 text-cyan-600'
                        : 'border-slate-100 bg-slate-50 text-slate-500',
                      'rounded-full border px-2 py-0.5 text-[10px] font-bold'
                    ]"
                  >
                    {{ e.tag }}
                  </span>
                </article>
              </li>
            </ul>

            <section
              class="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 class="text-sm font-bold text-slate-800">
                  모든 일정 한눈에 보기
                </h3>

                <p class="mt-1 text-xs text-slate-400">
                  조회한 행사를 내 일정에 등록하세요.
                </p>
              </div>

              <button
                class="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold transition-all hover:opacity-90 active:scale-[0.97]"
              >
                <span>📅</span>
                <span>캘린더 열기</span>
              </button>
            </section>
          </article>
</template>

<script setup lang="ts">
const events = [
  { title: '부산 바다축제', period: '08.01–08.03', tag: '진행 중' },
  { title: '나이트 뮤직 페스타', period: '08.07–08.08', tag: '예정' },
  { title: '비프광장 야시장', period: '08.12–08.16', tag: '예정' },
]
</script>