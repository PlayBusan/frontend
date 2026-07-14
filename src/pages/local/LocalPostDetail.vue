<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <RouterLink to="/local" class="text-sm text-slate-500">← 목록으로</RouterLink>

    <div v-if="post" class="mt-6 rounded-2xl bg-white p-6 shadow">
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs text-slate-500">{{ post.category }} · {{ post.date }}</div>
          <h1 class="mt-2 text-2xl font-bold text-slate-900">{{ post.title }}</h1>
          <div class="mt-4 text-sm text-slate-700">{{ post.excerpt }}</div>
        </div>
        <div class="text-sm text-slate-400">조회수 {{ post.views }}</div>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-slate-700">본문</h3>
        <p class="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{{ post.content || post.excerpt }}</p>
      </div>
    </div>

    <div v-else class="mt-6 text-sm text-slate-500">존재하지 않는 게시물입니다.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const post = ref(null)

function loadPosts() {
  const raw = localStorage.getItem('local_posts')
  const list = raw ? JSON.parse(raw) : []
  const found = list.find((p: any) => String(p.id) === String(id))
  if (found) {
    // increment views and persist
    found.views = (found.views || 0) + 1
    post.value = found
    localStorage.setItem('local_posts', JSON.stringify(list))
  }
}

onMounted(() => {
  loadPosts()
})
</script>
