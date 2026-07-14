<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <RouterLink to="/local" class="text-sm text-slate-500">← 목록으로</RouterLink>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 class="text-xl font-bold">새 글 작성</h2>

      <form @submit.prevent="submit" class="mt-4 space-y-4">
        <div>
          <label class="text-sm text-slate-600">카테고리</label>
          <select v-model="form.category" class="mt-2 w-full rounded-md border px-3 py-2">
            <option value="축제·행사">축제·행사</option>
            <option value="여행지">여행지</option>
            <option value="맛집">맛집</option>
            <option value="자유수다">자유수다</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-slate-600">제목</label>
          <input v-model="form.title" class="mt-2 w-full rounded-md border px-3 py-2" required />
        </div>

        <div>
          <label class="text-sm text-slate-600">본문</label>
          <textarea v-model="form.content" rows="6" class="mt-2 w-full rounded-md border px-3 py-2" />
        </div>

        <div class="flex items-center gap-2">
          <button type="submit" class="rounded-full bg-cyan-600 px-4 py-2 text-white">저장</button>
          <RouterLink to="/local" class="text-sm text-slate-500">취소</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  category: '축제·행사',
  title: '',
  content: '',
})

function submit() {
  const raw = localStorage.getItem('local_posts')
  const list = raw ? JSON.parse(raw) : []
  const id = Date.now()
  const post = {
    id,
    icon: '💬',
    category: form.category,
    title: form.title,
    excerpt: form.content.slice(0, 200),
    content: form.content,
    date: new Date().toISOString().slice(0, 10),
    views: 0,
  }
  list.unshift(post)
  localStorage.setItem('local_posts', JSON.stringify(list))
  router.push('/local')
}
</script>
