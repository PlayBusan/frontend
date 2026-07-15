<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <RouterLink to="/local" class="text-sm text-slate-500">
      ← 목록으로
    </RouterLink>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 class="text-xl font-bold">게시글 수정</h2>

      <form @submit.prevent="submit" class="mt-4 space-y-4">
        <div>
          <label class="text-sm text-slate-600">카테고리</label>
          <select
            v-model="form.category"
            class="mt-2 w-full rounded-md border px-3 py-2"
          >
            <option value="축제·행사">축제·행사</option>
            <option value="여행지">여행지</option>
            <option value="맛집">맛집</option>
            <option value="자유수다">자유수다</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-slate-600">제목</label>
          <input
            v-model="form.title"
            class="mt-2 w-full rounded-md border px-3 py-2"
            required
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">본문</label>
          <textarea
            v-model="form.content"
            rows="6"
            class="mt-2 w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label class="text-sm text-slate-600">비밀번호</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-2 w-full rounded-md border px-3 py-2"
            placeholder="게시글 비밀번호를 입력하세요"
            required
          />
        </div>

        <div class="flex items-center gap-2">
          <button
            type="submit"
            class="rounded-full bg-cyan-600 px-4 py-2 text-white"
          >
            수정
          </button>

          <RouterLink
            :to="`/local/${id}`"
            class="text-sm text-slate-500"
          >
            취소
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostById, updatePost } from '@/apis/posts'

const router = useRouter()
const route = useRoute()

const id = route.params.id as string

const form = reactive({
  category: '축제·행사',
  title: '',
  content: '',
  password: '',
})

const loadPost = async () => {
  try {
    const res = await fetchPostById(id)

    form.category = res.data.category
    form.title = res.data.title
    form.content = res.data.content
  } catch (error) {
    console.error('게시글 조회 실패', error)
  }
}

const submit = async () => {
  try {
    await updatePost(id, {
      title: form.title,
      content: form.content,
      category: form.category,
      password: form.password,
    })

    alert('게시글이 수정되었습니다.')

    router.push(`/local/${id}`)
  } catch (error) {
    console.error('게시글 수정 실패', error)
    alert('비밀번호가 올바르지 않거나 수정에 실패했습니다.')
  }
}

onMounted(() => {
  loadPost()
})
</script>