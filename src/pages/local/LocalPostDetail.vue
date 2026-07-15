<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <RouterLink to="/local" class="text-sm text-slate-500">← 목록으로</RouterLink>

    <div v-if="post" class="mt-6 rounded-2xl bg-white p-6 shadow">
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs text-slate-500">{{ post.category }} · {{ post.created_at }}</div>
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
import { fetchPostById } from '@/apis/posts'

const route = useRoute()
const id = route.params.id as string
const post = ref<any>(null)

const loadPost = async () => {
  try {
    const res = await fetchPostById(id)
    post.value = res.data
  } catch (error) {
    console.error('게시글 조회 실패', error)
    post.value = null
  }
}

onMounted(() => {
  loadPost()
})
</script>
