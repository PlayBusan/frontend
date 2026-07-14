<template>
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="mx-auto max-w-7xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
</script>