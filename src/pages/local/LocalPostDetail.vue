<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <RouterLink to="/local" class="text-sm text-slate-500">
      ← 목록으로
    </RouterLink>

    <div
      v-if="post"
      class="mt-6 rounded-2xl bg-white p-6 shadow"
    >
      <div class="flex items-start justify-between">
        <div>
          <div class="text-xs text-slate-500">
            {{ post.category }} · {{ post.created_at }}
          </div>

          <h1 class="mt-2 text-2xl font-bold text-slate-900">
            {{ post.title }}
          </h1>

          <div class="mt-2 text-sm text-slate-500">
            작성자 : {{ post.nickname }}
          </div>
        </div>

        <div class="text-sm text-slate-400">
          조회수 {{ post.views }}
        </div>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-slate-700">
          본문
        </h3>

        <p class="mt-2 whitespace-pre-wrap text-sm text-slate-600">
          {{ post.content }}
        </p>
      </div>

      <!-- 버튼 -->
      <div class="mt-8 flex justify-end gap-3 border-t pt-6">
        <button
          @click="goEdit"
          class="rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          수정
        </button>

        <button
          @click="removePost"
          class="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>

    <div
      v-else
      class="mt-6 text-sm text-slate-500"
    >
      존재하지 않는 게시물입니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchPostById } from '@/apis/posts'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchPostById,
  deletePost,
} from '@/apis/posts'

const route = useRoute()
const router = useRouter()

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

const goEdit = () => {
  router.push(`/local/edit/${id}`)
}

const removePost = async () => {
  const password = prompt('게시글 비밀번호를 입력하세요.')

  if (!password) return

  try {
    await deletePost(id, password)

    alert('게시글이 삭제되었습니다.')

    router.push('/local')
  } catch (error) {
    console.error(error)
    alert('삭제에 실패했습니다.')
  }
}

onMounted(() => {
  loadPost()
})
</script>