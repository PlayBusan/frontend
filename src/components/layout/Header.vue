<template>
  <header
    class="fixed top-0 left-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink
        to="/"
        class="text-xl font-bold text-blue-600"
      >
        Logo
      </RouterLink>

      <nav>
        <ul class="flex items-center gap-8">
          <li>
            <RouterLink
              to="/"
              class="transition hover:text-blue-500"
              active-class="text-blue-600 font-semibold"
            >
              Home
            </RouterLink>
          </li>

          <li>
            <RouterLink
              to="/board"
              class="transition hover:text-blue-500"
              active-class="text-blue-600 font-semibold"
            >
              Board
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>