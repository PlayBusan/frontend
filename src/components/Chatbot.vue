```vue
<template>
  <div
    class="fixed inset-0 z-50 flex"
    :class="expanded ? 'items-center justify-center' : 'items-end justify-end'"
  >
    <!-- 배경 -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('close')"
    ></div>

    <transition name="slide-up">
      <div
       :class="[
          'z-50 bg-white shadow-2xl transition-all duration-300 flex flex-col',
          expanded
            ? 'w-[56vw] h-[70vh] rounded-2xl'
            : 'm-6 w-80 min-h-[400px] rounded-[18px]'
        ]"
      >
        <!-- Header -->
        <header
          class="flex items-start justify-between gap-3 rounded-t-[18px] bg-white px-4 py-3 border-b border-slate-100"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"
            >
              🤖
            </div>

            <div>
              <div class="text-sm font-semibold text-slate-900">
                부산 AI 도우미
              </div>
              <div class="mt-1 text-xs text-slate-500">
                행사 · 장소 · 동네 팁
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- 확대 / 축소 -->
            <button
              @click="toggleExpand"
              class="text-lg text-slate-400 transition hover:text-slate-700"
            >
              {{ expanded ? "🗗" : "🗖" }}
            </button>

            <!-- 닫기 -->
            <button
              @click="$emit('close')"
              class="text-lg text-slate-400 transition hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </header>

        <!-- Body -->
        <div class="flex flex-1 flex-col p-4 overflow-hidden">
          <!-- Chat -->
          <div
            ref="chatArea"
            :class="[
              'chat-area flex-1 overflow-y-auto rounded-md bg-white transition-all'
            ]"
          >
            <div
              v-for="(m, i) in messages"
              :key="i"
              :class="[
                'mb-3 flex',
                m.from === 'bot'
                  ? 'justify-start'
                  : 'justify-end'
              ]"
            >
              <div
                :class="[
                  'max-w-[80%] rounded-2xl px-4 py-2 text-sm break-words whitespace-pre-wrap',
                  m.from === 'bot'
                    ? 'bg-sky-50 text-slate-800'
                    : 'bg-cyan-500 text-white'
                ]"
              >
                {{ m.text }}
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="mt-3 flex items-center gap-2">
            <input
              ref="inputEl"
              v-model="input"
              @keydown.enter="send"
              placeholder="궁금한 내용을 입력하세요"
              :class="[
                'flex-1 rounded-full border border-slate-200 focus:outline-none transition',
                expanded
                  ? 'px-5 py-3 text-base'
                  : 'px-4 py-2 text-sm'
              ]"
            />

            <button
              @click="send"
              :class="[
                'inline-flex items-center justify-center rounded-full bg-cyan-500 text-white shadow transition',
                expanded
                  ? 'h-12 w-12 text-xl'
                  : 'h-10 w-10'
              ]"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { askChat } from "@/apis/chat";

const input = ref("");

const inputEl = ref<HTMLInputElement | null>(null);
const chatArea = ref<HTMLDivElement | null>(null);

const expanded = ref(false);

function toggleExpand() {
  expanded.value = !expanded.value;

  nextTick(() => {
    scrollBottom();
  });
}

const messages = ref<
  Array<{
    from: "user" | "bot";
    text: string;
  }>
>([]);

function scrollBottom() {
  nextTick(() => {
    if (chatArea.value) {
      chatArea.value.scrollTop = chatArea.value.scrollHeight;
    }
  });
}

onMounted(() => {
  messages.value.push({
    from: "bot",
    text: "안녕하세요 😊\n부산 행사와 동네 정보를 찾아드릴게요.",
  });

  nextTick(() => {
    inputEl.value?.focus();
    scrollBottom();
  });
});

async function send() {
  if (!input.value.trim()) return;

  const userText = input.value;

  messages.value.push({
    from: "user",
    text: userText,
  });

  input.value = "";
  scrollBottom();

  messages.value.push({
    from: "bot",
    text: "답변을 생성 중입니다...",
  });

  scrollBottom();

  try {
    const answer = await askChat(userText);

    messages.value.pop();

    messages.value.push({
      from: "bot",
      text: answer,
    });
  } catch (error) {
    console.error(error);

    messages.value.pop();

    messages.value.push({
      from: "bot",
      text: "죄송합니다.\nOpenAI와 연결하지 못했습니다.",
    });
  }

  scrollBottom();
}
</script>

<style scoped>
.chat-area::-webkit-scrollbar {
  width: 6px;
}

.chat-area::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 999px;
}

.shadow-2xl {
  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.12);
}

.slide-up-enter-from {
  transform: translateY(18px);
  opacity: 0;
}

.slide-up-enter-active {
  transition:
    transform 220ms cubic-bezier(.22,.9,.35,1),
    opacity 220ms ease;
}

.slide-up-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.slide-up-leave-active {
  transition:
    transform 160ms ease,
    opacity 160ms ease;
}

.slide-up-leave-to {
  transform: translateY(12px);
  opacity: 0;
}
</style>