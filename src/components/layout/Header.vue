<template>
  <header class="fixed top-0 left-0 z-50 w-full bg-[#0f3550] text-white">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink to="/" class="flex items-center gap-3">
        <span class="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-slate-900 font-bold">파</span>
        <span class="font-semibold tracking-wide">부산놀러가요</span>
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-6 text-sm font-medium">
          <li>
            <RouterLink to="/" class="transition hover:text-cyan-200" active-class="text-cyan-200 font-semibold">
              커뮤니티
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/calendar" class="transition hover:text-cyan-200">
              행사 캘린더
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/guide" class="transition hover:text-cyan-200">
              부산 가이드
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-4">
        <button class="hidden rounded-full border border-white/20 px-3 py-1 text-sm transition hover:bg-white/10 md:inline-block">알림</button>
        <RouterLink to="/write" class="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow">+ 글쓰기</RouterLink>
      </div>
    </div>
  </header>
</template>