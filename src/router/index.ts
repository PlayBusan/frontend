import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/home/HomePage.vue'
import BoardPage from '@/pages/board/BoardPage.vue'
import CalendarPage from '@/pages/calendar/CalendarPage.vue'
import LocalTalkPage from '@/pages/local/LocalTalkPage.vue'
import LocalPostDetail from '@/pages/local/LocalPostDetail.vue'
import LocalWritePage from '@/pages/local/LocalWritePage.vue'
import LocalEditPage from '@/pages/local/LocalEditPage.vue'
import TourPage from '@/pages/tour/TourPage.vue'

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
    {
      path: '/local',
      name: 'local',
      component: LocalTalkPage,
    },
    {
      path: '/local/write',
      name: 'local-write',
      component: LocalWritePage,
    },
    {
      path: '/local/:id',
      name: 'local-detail',
      component: LocalPostDetail,
      props: true,
    },
    {
      path: '/local/edit/:id',
      name: 'localEdit',
      component: LocalEditPage,
    },
    {path: '/tour',
      name: 'tour',
      component: TourPage,
    },
  ],
})

export default router
