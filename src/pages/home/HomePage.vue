<template>
  <section class="space-y-8">
    <div class="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-slate-50 to-white p-6">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-3">
            <span class="inline-block rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-600">BUSAN LOCAL COMMUNITY</span>
          </div>

          <h1 class="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            오늘 부산,
            <span class="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">뭐 하고 놀까?</span>
          </h1>

          <p class="max-w-xl text-base text-slate-600">부산 사람들의 진짜 이야기와 지금 열리는 행사까지. 우리 동네의 좋은 순간을 가볍게 나눠요.</p>

          <div class="flex flex-wrap gap-3">
            <button class="rounded-full bg-cyan-500 px-5 py-3 font-semibold text-white shadow hover:bg-cyan-400">이번 달 행사 보기</button>
            <button class="rounded-full border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700">동네 이야기 구경하기</button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="rounded-2xl bg-white p-4 shadow-lg">
            <div class="rounded-xl bg-[#0b2b48] p-4 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium opacity-80">BUSAN COAST · 07:00</div>
                  <div class="mt-2 flex items-center gap-3">
                    <div class="text-2xl">🌤️</div>
                    <div>
                      <div class="text-sm opacity-80">구름 조금</div>
                      <div class="text-3xl font-bold">28°</div>
                    </div>
                  </div>
                </div>
                <div class="text-right text-sm opacity-70">강수확률 10%</div>
              </div>
            </div>

            <ul class="mt-4 divide-y">
              <li v-for="(e, i) in events" :key="i" class="flex items-center justify-between px-3 py-3">
                <div>
                  <div class="text-sm font-medium text-slate-800">{{ e.title }}</div>
                  <div class="mt-1 text-xs text-slate-500">{{ e.period }}</div>
                </div>
                <div class="text-xs text-slate-400">{{ e.tag }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="rounded-2xl bg-white p-6 shadow">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-semibold text-cyan-600">LOCAL TALK</div>
              <h3 class="mt-2 text-xl font-bold text-slate-900">지금 부산에서 나누는 이야기</h3>
            </div>
            <div class="text-sm text-slate-400">전체 보기 ›</div>
          </div>

          <ul class="mt-4 space-y-3">
            <li v-for="(p, idx) in posts" :key="idx" class="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <div class="text-sm font-medium text-slate-800">{{ p.title }}</div>
                <div class="mt-1 text-xs text-slate-500">{{ p.category }} · {{ p.date }}</div>
              </div>
              <div class="text-xs text-slate-400">{{ p.views }}</div>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div class="rounded-2xl bg-[#0b2b48] p-6 text-white shadow">
          <div class="text-sm font-semibold opacity-80">BUSAN EVENT JSON</div>
          <h3 class="mt-3 text-lg font-bold">쌓여진 행사 정보, 날짜별로 한눈에.</h3>
          <p class="mt-3 text-sm opacity-80">캘린더에서 간편하게 일정을 확인해보세요.</p>
          <button class="mt-6 w-full rounded-full bg-cyan-400 px-4 py-3 font-semibold text-slate-900">캘린더 열기</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { label: '추천 명소', value: '24+' },
  { label: '맛집 코스', value: '18개' },
  { label: '바다 감성', value: '100%' },
]

const itinerary = [
  '해운대에서 아침 산책과 바다뷰 카페',
  '감천문화마을에서 색감 있는 골목 탐방',
  '자갈치시장과 광안리 야경까지 마무리',
]

const highlights = [
  {
    icon: '🌅',
    title: '바다와 도시의 조화',
    description: '해변과 산책로가 가깝게 이어져 하루 종일 여유롭게 둘러볼 수 있습니다.',
  },
  {
    icon: '🍜',
    title: '다양한 먹거리',
    description: '해산물, 국밥, 디저트까지 부산만의 맛을 충분히 즐길 수 있습니다.',
  },
  {
    icon: '🎨',
    title: '감성 있는 골목',
    description: '벽화와 작은 카페들이 모여 도시 여행의 분위기를 더해줍니다.',
  },
]

const destinations = [
  {
    title: '해운대',
    description: '바다와 야경이 아름다운 부산의 대표 명소입니다.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '감천문화마을',
    description: '다채로운 벽화와 골목이 여행의 포인트가 됩니다.',
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '자갈치시장',
    description: '해산물과 부산의 활기를 가까이 느낄 수 있는 곳입니다.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: '광안리',
    description: '일몰과 야경이 특히 아름다워 저녁 코스로 추천합니다.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80',
  },
]

const events = [
  { title: '부산 바다축제', period: '08.01–08.03', tag: '진행 중' },
  { title: '나이트 뮤직 페스타', period: '08.07–08.08', tag: '예정' },
  { title: '비프광장 야시장', period: '08.12–08.16', tag: '예정' },
]

const posts = [
  { title: '바다축제 갈 때 도자기 챙겨야 할까요?', category: '축제·행사', date: '2026.07.14', views: 124 },
  { title: '기장 쪽 조용한 브런치 카페 추천', category: '맛집', date: '2026.07.13', views: 86 },
  { title: '힐여운문화마을 쉬 멋 무림 산책 코스', category: '여행지', date: '2026.07.12', views: 201 },
]
</script>