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


      <!-- 수정 카드 -->
      <div
        class="
          mt-6
          rounded-3xl
          border
          border-slate-100
          bg-white
          p-8
          shadow-sm
        "
      >


        <!-- Header -->
        <div class="border-b border-slate-100 pb-6">

          <span
            class="
              inline-flex
              rounded-full
              bg-blue-50
              px-3
              py-1
              text-xs
              font-semibold
              text-blue-700
            "
          >
            게시글 수정
          </span>


          <h1
            class="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            게시글 수정
          </h1>


          <p
            class="
              mt-2
              text-sm
              text-slate-500
            "
          >
            작성한 게시글의 내용을 수정할 수 있습니다.
          </p>

        </div>



        <form
          @submit.prevent="submit"
          class="mt-8 space-y-6"
        >


          <!-- 카테고리 -->
          <div>

            <label
              class="
                text-sm
                font-bold
                text-slate-700
              "
            >
              카테고리
            </label>


            <select
              v-model="form.category"
              class="
                mt-3
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-700
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            >

              <option value="축제·행사">
                축제·행사
              </option>

              <option value="여행지">
                여행지
              </option>

              <option value="맛집">
                맛집
              </option>

              <option value="자유수다">
                자유수다
              </option>

            </select>

          </div>




          <!-- 제목 -->
          <div>

            <label
              class="
                text-sm
                font-bold
                text-slate-700
              "
            >
              제목
            </label>


            <input
              v-model="form.title"
              required
              class="
                mt-3
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>




          <!-- 내용 -->
          <div>

            <label
              class="
                text-sm
                font-bold
                text-slate-700
              "
            >
              내용
            </label>


            <textarea
              v-model="form.content"
              rows="8"
              class="
                mt-3
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                leading-7
                text-slate-800
                outline-none
                transition
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>




          <!-- 비밀번호 -->
          <div>

            <label
              class="
                text-sm
                font-bold
                text-slate-700
              "
            >
              비밀번호 확인
            </label>


            <input
              v-model="form.password"
              type="password"
              required
              placeholder="게시글 작성 시 입력한 비밀번호"
              class="
                mt-3
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-800
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
              "
            />


            <p
              class="
                mt-2
                text-xs
                text-slate-400
              "
            >
              게시글 수정 확인을 위해 비밀번호가 필요합니다.
            </p>

          </div>




          <!-- 버튼 -->
          <div
            class="
              flex
              justify-end
              gap-3
              border-t
              border-slate-100
              pt-6
            "
          >


            <RouterLink
              :to="`/local/${id}`"
              class="
                rounded-xl
                bg-slate-100
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-200
                active:scale-95
              "
            >
              취소
            </RouterLink>



            <button
              type="submit"
              class="
                rounded-xl
                bg-blue-500
                px-6
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-600
                active:scale-95
              "
            >
              수정 완료
            </button>


          </div>


        </form>


      </div>


    </div>

  </div>
</template>



<script setup lang="ts">

import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  fetchPostById,
  updatePost
} from '@/apis/posts'


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


  } catch(error){

    console.error(
      '게시글 조회 실패',
      error
    )

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



  } catch(error){


    console.error(
      '게시글 수정 실패',
      error
    )


    alert(
      '비밀번호가 올바르지 않거나 수정에 실패했습니다.'
    )


  }

}




onMounted(() => {

  loadPost()

})

</script>