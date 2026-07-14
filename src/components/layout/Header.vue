<template>
  <header
    class="fixed top-0 left-0 z-50 w-full border-white/20 bg-white/70 backdrop-blur-xl shadow-sm"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="font-semibold tracking-wide">PLAY BUSAN</span>
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-6 text-sm font-medium">
          <li>
            <RouterLink
              to="/"
              class="transition hover:text-cyan-500"
              active-class="font-semibold text-cyan-500"
            >
              커뮤니티
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/calendar"
              class="transition hover:text-cyan-500"
              active-class="font-semibold text-cyan-500"
            >
              행사 캘린더
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/guide"
              class="transition hover:text-cyan-500"
              active-class="font-semibold text-cyan-500"
            >
              부산 가이드
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-4"></div>
    </div>
  </header>
</template>