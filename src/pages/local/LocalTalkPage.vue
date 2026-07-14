<template>
  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-6">
      <RouterLink to="/" class="text-sm text-slate-500">← 홈으로</RouterLink>
    </div>

    <div class="mb-6 flex items-start justify-between">
      <div>
        <div class="text-sm font-medium text-cyan-600">BUSAN COMMUNITY</div>
        <h1 class="mt-2 text-3xl font-extrabold text-slate-900">부산의 작은 소식들</h1>
        <p class="mt-2 text-sm text-slate-500">부산 사람들의 진짜 이야기와 지금 열리는 행사까지. 우리 동네의 좋은 순간을 가볍게 나눠요.</p>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden md:block">
          <input v-model="search" placeholder="제목, 내용 검색" class="rounded-full border border-slate-200 px-4 py-2 text-sm shadow-sm" />
        </div>
        <div>
          <select v-model="sort" class="rounded-full border border-slate-200 px-3 py-2 text-sm">
            <option value="new">최신순</option>
            <option value="views">조회수순</option>
          </select>
        </div>
        <button @click="goWrite" class="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">+ 글쓰기</button>
      </div>
    </div>

    <div class="rounded-2xl bg-white p-6 shadow">
      <div class="mb-4 flex items-center gap-3">
        <template v-for="cat in categories" :key="cat">
          <button
            @click="category = cat"
            :class="[
              'rounded-full px-3 py-1 text-sm border min-w-[72px] flex items-center justify-center',
              category === cat ? 'border-cyan-600 bg-cyan-600 text-[#2768FF]' : 'border-slate-200 bg-white text-slate-600'
            ]"
          >
            {{ cat }}
          </button>
        </template>
      </div>

      <ul class="space-y-4">
        <li v-for="(post, idx) in paged" :key="post.id" @click="goDetail(post)" class="cursor-pointer rounded-xl border border-slate-100 p-4 shadow-sm hover:bg-slate-50">
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">{{ post.icon }}</div>
              <div>
                <div class="text-sm text-slate-500">{{ post.category }}</div>
                <div class="mt-1 text-lg font-semibold text-slate-900">{{ post.title }}</div>
                <div class="mt-2 text-sm text-slate-600">{{ post.excerpt }}</div>
              </div>
            </div>

            <div class="text-right text-sm text-slate-400">
              <div>{{ post.date }}</div>
              <div class="mt-2">{{ post.views }}</div>
            </div>
          </div>
        </li>
      </ul>

      <div class="mt-6 flex items-center justify-between">
        <div class="text-sm text-slate-500">총 {{ filtered.length }}건</div>
        <div class="flex items-center gap-2">
          <button @click="changePage(page - 1)" :disabled="page<=1" class="px-3 py-1 rounded border">이전</button>
          <div class="px-3 py-1">{{ page }} / {{ totalPages }}</div>
          <button @click="changePage(page + 1)" :disabled="page>=totalPages" class="px-3 py-1 rounded border">다음</button>
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
const initial = raw ? JSON.parse(raw) : [
  { id: 1, icon: '🎪', category: '축제·행사', title: '바다축제 갈 때 도자기 챙겨야 할까요?', excerpt: '해운대 쪽 잔디 구역에서 불 예정이에요. 작년에 다녀오신 분들 있으면 자리 잡기 좋은 시간도 알려주세요!', date: '2026.07.14', views: 124 },
  { id: 2, icon: '☕', category: '맛집', title: '기장 쪽 조용한 브런치 카페 추천', excerpt: '주말 오전에 바다 보면서 커피 마시기 좋은 곳을 찾고 있어요. 주차 가능한 곳이면 더 좋아요.', date: '2026.07.13', views: 86 },
  { id: 3, icon: '🗺️', category: '여행지', title: '힐여운문화마을에 괜찮은 산책 코스', excerpt: '절영해안산책로에서 힐여운문화마을로 이어지는 길을 추천합니다. 편한 신발은 필수예요!', date: '2026.07.12', views: 201 },
  { id: 4, icon: '💬', category: '자유수다', title: '부산 초보의 장마철 이동 팁', excerpt: '부산 여행 처음인데 비 예보가 있네요. 비 오는 날에도 분위기 좋은 동네가 있을까요?', date: '2026.07.11', views: 59 },
]

const posts = ref(initial)
const search = ref('')
const category = ref('전체')
const sort = ref('new')

const page = ref(1)
const perPage = ref(6)

onMounted(() => {
  // ensure storage exists
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
.rounded-2xl { border-radius: 18px; }
</style>
