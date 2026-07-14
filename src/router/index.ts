import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/home/HomePage.vue'
import BoardPage from '@/pages/board/BoardPage.vue'
import CalendarPage from '@/pages/calendar/CalendarPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/board',
      name: 'board',
      component: BoardPage,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarPage,
    },
  ],
})

export default router