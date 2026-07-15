<!-- src/views/Community.vue -->
<template>
  <div
    class="relative min-h-screen bg-gradient-to-b from-secondary/10 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
  >
    <!-- 캘린더와 동일한 백그라운드 블러 효과 추가 -->
    <div class="absolute left-10 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
    <div class="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

    <div class="relative z-10 mx-auto max-w-7xl">
      <!-- 페이지 헤더 -->
      <div class="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span
            class="inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-primary"
          >
            BUSAN COMMUNITY
          </span>
          <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            부산의 작은 소식들
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            부산 사람들의 진짜 이야기와 지금 열리는 행사까지. 우리 동네의 좋은 순간을 가볍게 나눠요.
          </p>
        </div>

        <!-- 우측 컨트롤 박스들 (둥글고 세련된 보더 및 쉐도우 조율) -->
        <div class="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
          <div class="flex-1 md:flex-none">
            <input
              v-model="search"
              placeholder="제목, 내용 검색"
              class="w-full rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
            />
          </div>
          <div>
            <select
              v-model="sort"
              class="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all duration-200"
            >
              <option value="new">최신순</option>
              <option value="views">조회수순</option>
            </select>
          </div>
          <button
            @click="goWrite"
            class="rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/10 transition-all duration-150 hover:scale-[1.02] hover:shadow-primary/25 active:scale-[0.98]"
          >
            + 글쓰기
          </button>
        </div>
      </div>

      <!-- 메인 리스트 카드 영역 (캘린더의 시그니처 쉐도우 및 백드롭 필터 차용) -->
      <div
        class="rounded-3xl border border-gray-300/40 p-6 sm:p-8 shadow-xl shadow-slate-100/30 backdrop-blur-md flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/30 bg-white/70"
      >
        <!-- 카테고리 필터 버튼 그룹 -->
        <div class="mb-6 flex flex-wrap items-center gap-2">
          <template v-for="cat in categories" :key="cat">
            <button
              @click="category = cat"
              :class="[
                'rounded-full px-4 py-1.5 text-sm font-semibold border transition-all duration-200 min-w-[76px] flex items-center justify-center',
                category === cat
                  ? 'border-primary bg-primary text-white shadow-sm shadow-primary/10'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              ]"
            >
              {{ cat }}
            </button>
          </template>
        </div>

        <!-- 커뮤니티 포스트 리스트 -->
        <ul class="space-y-4">
          <li
            v-for="(post, idx) in paged"
            :key="post.id"
            @click="goDetail(post)"
            class="group cursor-pointer rounded-2xl border border-slate-100 p-5 bg-white/40 shadow-sm transition-all duration-200 hover:bg-white hover:scale-[1.005] hover:shadow-md hover:border-primary/20"
          >
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div class="flex items-start gap-4">
                <!-- 아바타 아이콘 영역 (캘린더 이벤트의 데코 스타일을 녹여냄) -->
                <div
                  class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 text-xl border border-secondary/20 shadow-inner group-hover:from-secondary/50 group-hover:to-secondary/20 transition-all duration-200"
                >
                  {{ post.icon }}
                </div>
                <div>
                  <div class="text-xs font-semibold text-primary uppercase tracking-wider">
                    {{ post.category }}
                  </div>
                  <div
                    class="mt-1 text-lg font-bold text-slate-800 group-hover:text-primary transition-colors duration-150"
                  >
                    {{ post.title }}
                  </div>
                  <div class="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {{ post.excerpt }}
                  </div>
                </div>
              </div>

              <!-- 우측 통계 및 날짜 정보 -->
              <div
                class="flex sm:flex-col justify-between items-center sm:items-end text-sm text-slate-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100"
              >
                <div class="font-medium text-slate-400">{{ post.date }}</div>
                <div
                  class="mt-0 sm:mt-2 flex items-center gap-1.5 bg-slate-100/50 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500"
                >
                  <span>조회</span>
                  <span class="text-slate-800">{{ post.views }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- 하단 페이지네이션 컨트롤 -->
        <div class="mt-8 pt-6 border-t border-slate-100/80 flex items-center justify-between">
          <div class="text-sm font-semibold text-slate-500">
            총 <span class="text-primary">{{ filtered.length }}</span> 건의 이야기
          </div>
          <div class="flex items-center gap-1.5">
            <button
              @click="changePage(page - 1)"
              :disabled="page <= 1"
              class="px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-150"
            >
              이전
            </button>
            <div class="px-3 text-sm font-bold text-slate-700">{{ page }} / {{ totalPages }}</div>
            <button
              @click="changePage(page + 1)"
              :disabled="page >= totalPages"
              class="px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-150"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const raw = localStorage.getItem('local_posts')
const initial = raw
  ? JSON.parse(raw)
  : [
      {
        id: 1,
        icon: '🎪',
        category: '축제·행사',
        title: '바다축제 갈 때 도자기 챙겨야 할까요?',
        excerpt:
          '해운대 쪽 잔디 구역에서 볼 예정이에요. 작년에 다녀오신 분들 있으면 자리 잡기 좋은 시간도 알려주세요!',
        date: '2026.07.14',
        views: 124,
      },
      {
        id: 2,
        icon: '☕',
        category: '맛집',
        title: '기장 쪽 조용한 브런치 카페 추천',
        excerpt:
          '주말 오전에 바다 보면서 커피 마시기 좋은 곳을 찾고 있어요. 주차 가능한 곳이면 더 좋아요.',
        date: '2026.07.13',
        views: 86,
      },
      {
        id: 3,
        icon: '🗺️',
        category: '여행지',
        title: '힐여운문화마을에 괜찮은 산책 코스',
        excerpt:
          '절영해안산책로에서 힐여운문화마을로 이어지는 길을 추천합니다. 편한 신발은 필수예요!',
        date: '2026.07.12',
        views: 201,
      },
      {
        id: 4,
        icon: '💬',
        category: '자유수다',
        title: '부산 초보의 장마철 이동 팁',
        excerpt: '부산 여행 처음인데 비 예보가 있네요. 비 오는 날에도 분위기 좋은 동네가 있을까요?',
        date: '2026.07.11',
        views: 59,
      },
    ]

const posts = ref(initial)
const search = ref('')
const category = ref('전체')
const sort = ref('new')

const page = ref(1)
const perPage = ref(6)

onMounted(() => {
  if (!raw) localStorage.setItem('local_posts', JSON.stringify(initial))
})

const categories = computed(() => ['전체', '축제·행사', '여행지', '맛집', '자유수다'])

const filtered = computed(() => {
  let list = posts.value.slice()
  if (category.value !== '전체') {
    list = list.filter((p: any) => p.category === category.value)
  }
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter((p: any) => (p.title + ' ' + (p.excerpt || '')).toLowerCase().includes(q))
  }
  if (sort.value === 'new') {
    list.sort((a: any, b: any) => (b.id || 0) - (a.id || 0))
  } else if (sort.value === 'views') {
    list.sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))

const paged = computed(() => {
  const start = (page.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

function goDetail(post: any) {
  router.push(`/local/${post.id}`)
}

function goWrite() {
  router.push('/local/write')
}

function changePage(n: number) {
  page.value = Math.max(1, Math.min(totalPages.value, n))
}
</script>

<style scoped>
/* 테마의 라운딩 모듈화 */
.rounded-2xl {
  border-radius: 18px;
}
.rounded-3xl {
  border-radius: 24px;
}
</style>
