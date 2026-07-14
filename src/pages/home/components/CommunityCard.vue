<template>
   <article
            class="flex flex-1 flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <header
              class="flex items-center justify-between border-b border-slate-100 pb-4"
            >
              <div>
                <span
                  class="text-[10px] font-bold uppercase tracking-wider text-cyan-600"
                >
                  LOCAL TALK
                </span>

                <h2 class="text-lg font-bold text-slate-900">
                  부산 이야기 게시판
                </h2>
              </div>

              <button
                class="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                전체 보기 ›
              </button>
            </header>

            <ul class="mt-4 space-y-2.5">
              <li
                v-for="(p, idx) in posts"
                :key="idx"
              >
                <article
                  class="group flex flex-col justify-between rounded-2xl border border-slate-100 p-4 transition-all hover:border-cyan-200 hover:bg-cyan-50/10 sm:flex-row sm:items-center"
                >
                  <div
                    class="text-sm text-slate-800 transition-colors group-hover:text-cyan-700"
                  >
                    {{ p.title }}
                  </div>

                  <div
                    class="mt-2 flex shrink-0 items-center justify-between gap-4 text-xs text-slate-400 sm:mt-0"
                  >
                    <span>{{ p.category }} · {{ p.date }}</span>

                    <span class="flex items-center gap-1">
                      👁️ {{ p.views }}
                    </span>
                  </div>
                </article>
              </li>
            </ul>
          </article>
</template>

<script setup lang="ts">



const posts = [
  {
    title: '바다축제 갈 때 돗자리 챙겨야 할까요?',
    category: '축제·행사',
    date: '2026.07.14',
    views: 124,
  },
  {
    title: '기장 쪽 조용한 브런치 카페 추천',
    category: '맛집',
    date: '2026.07.13',
    views: 86,
  },
  {
    title: '흰여울문화마을 숨은 멋 구경 산책 코스',
    category: '여행지',
    date: '2026.07.12',
    views: 201,
  },
]
</script>
