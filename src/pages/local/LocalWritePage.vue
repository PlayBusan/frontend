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

        <div>
          <label class="text-sm text-slate-600">작성자 닉네임</label>
          <input v-model="form.nickname" class="mt-2 w-full rounded-md border px-3 py-2" placeholder="닉네임을 입력하세요" required />
        </div>

        <div>
          <label class="text-sm text-slate-600">비밀번호</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-2 w-full rounded-md border px-3 py-2"
            placeholder="비밀번호를 입력하세요"
            required
          />
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
import { createPost } from '@/apis/posts'

const router = useRouter()

const form = reactive({
  category: '축제·행사',
  title: '',
  content: '',
  nickname: '',
  password: '',
})

const submit = async () => {
  try {
    await createPost({
      title: form.title,
      content: form.content,
      category: form.category,
      nickname: form.nickname || '익명',
      password: form.password || '0000',
    })
    router.push('/local')
  } catch (error) {
    console.error('게시글 작성 실패', error)
  }
}
</script>
