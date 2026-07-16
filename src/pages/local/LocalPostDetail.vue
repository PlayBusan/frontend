<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <!-- 목록 이동 -->
      <RouterLink
        to="/local"
        class="inline-flex items-center text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        ← 목록으로
      </RouterLink>

      <!-- 게시글 카드 -->
      <div v-if="post" class="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <!-- 상단 정보 -->
        <div class="flex items-start justify-between">
          <div>
            <!-- 카테고리 -->
            <span
              class="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {{ post.category }}
            </span>

            <!-- 제목 -->
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {{ post.title }}
            </h1>

            <!-- 작성 정보 -->
            <div class="mt-4 flex items-center gap-3 text-sm text-slate-500">
              <span> 작성자 {{ post.nickname }} </span>

              <span class="text-slate-300"> | </span>

              <span>
                {{ post.created_at }}
              </span>
            </div>
          </div>

          <!-- 조회수 -->
          <div class="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-500">
            조회 {{ post.views }}
          </div>
        </div>

        <!-- 구분선 -->
        <div class="my-8 border-t border-slate-100"></div>

        <!-- 본문 -->
        <section>
          <h3 class="mb-3 text-sm font-bold text-slate-700">내용</h3>

          <div class="min-h-[220px] rounded-2xl bg-slate-50 p-6 text-sm leading-7 text-slate-700">
            {{ post.content }}
          </div>
        </section>

        <!-- 버튼 -->
        <div class="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            @click="goEdit"
            class="
              rounded-xl
              bg-yellow-100
              px-4
              py-1
              text-sm
              font-semibold
              text-orange-700
              transition
              hover:bg-yellow-200
              active:scale-95
            "
          >
            수정
          </button>

          <button
            @click="removePost"
            class="
              rounded-xl
              bg-pink-100
              px-4
              py-1
              text-sm
              font-semibold
              text-red-600
              transition
              hover:bg-pink-200
              active:scale-95
            "
          >
            삭제
          </button>
        </div>
      </div>

      <!-- 없는 게시글 -->
      <div
        v-else
        class="mt-6 rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm"
      >
        존재하지 않는 게시물입니다.
      </div>

      <div class="mt-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 class="text-xl font-bold text-slate-900">댓글</h2>

        <div class="mt-6 space-y-4">
          <div v-if="comments.length === 0" class="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
            아직 등록된 댓글이 없습니다.
          </div>

          <div v-for="comment in comments" :key="comment.id" class="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-800">{{ comment.nickname }}</p>
                <p class="text-xs text-slate-500">댓글 내용</p>
              </div>
            </div>
            <p class="mt-4 text-sm leading-7 text-slate-700">{{ comment.content }}</p>
          </div>
        </div>

        <div class="mt-8">
          <textarea
            v-model="newComment"
            rows="4"
            placeholder="댓글을 입력하세요."
            class="w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></textarea>

          <div class="mt-4 flex justify-end">
            <button
              @click="submitComment"
              class="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              댓글 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 비밀번호 모달 -->
  <div
    v-if="showPasswordModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="w-96 rounded-3xl bg-white p-6 shadow-xl">
      <h2 class="text-lg font-bold text-slate-900">게시글 삭제</h2>

      <p class="mt-2 text-sm text-slate-500">게시글 비밀번호를 입력해주세요.</p>

      <input
        v-model="passwordInput"
        type="password"
        placeholder="비밀번호"
        class="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
      />

      <div class="mt-5 flex justify-end gap-3">
        <button
          @click="showPasswordModal = false"
          class="rounded-xl bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-600"
        >
          취소
        </button>

        <button
          @click="confirmDelete"
          class="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostById, deletePost, fetchComments, createComment } from '@/apis/posts'

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const post = ref<any>(null)
const comments = ref<any[]>([])
const newComment = ref('')

const loadPost = async () => {
  try {
    const res = await fetchPostById(id)

    post.value = res.data
  } catch (error) {
    console.error('게시글 조회 실패', error)

    post.value = null
  }
}

const loadComments = async () => {
  try {
    const res = await fetchComments(id)
    comments.value = res.data
  } catch (error) {
    console.error('댓글 조회 실패', error)
    comments.value = []
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력해주세요.')
    return
  }

  try {
    await createComment({ post_id: id, content: newComment.value.trim() })
    newComment.value = ''
    await loadComments()
  } catch (error) {
    console.error('댓글 등록 실패', error)
    alert('댓글 등록에 실패했습니다.')
  }
}

const goEdit = () => {
  router.push(`/local/edit/${id}`)
}

const showPasswordModal = ref(false)
const passwordInput = ref('')

const removePost = () => {
  showPasswordModal.value = true
}

const confirmDelete = async () => {
  if (!passwordInput.value) {
    alert('비밀번호를 입력해주세요.')
    return
  }

  try {
    await deletePost(id, passwordInput.value)

    alert('게시글이 삭제되었습니다.')

    router.push('/local')
  } catch (error) {
    console.error(error)

    alert('삭제에 실패했습니다.')
  }

  showPasswordModal.value = false
  passwordInput.value = ''
}

onMounted(() => {
  loadPost()
  loadComments()
})
</script>
