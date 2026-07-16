<template>
  <section class="not-found-page">
    <div class="not-found-card">
      <h1 class="font-bold text-red-700">404</h1>
      <p>페이지를 찾을 수 없습니다.</p>
      <router-link to="/" class="!underline !text-gray-500 underline-offset-1 font-semibold">홈으로 돌아가기</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 24px;
  background: #f8fafc;
}

.not-found-card {
  text-align: center;
  border-radius: 24px;
}

.not-found-card h1 {
  font-size: 4rem;
}

.not-found-card p {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 8px;
}


</style>