<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <main class="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
</script>