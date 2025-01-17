import { createRouter, createWebHistory } from 'vue-router'
import EncryptView from '@/views/EncryptView.vue'
import LayoutView from '@/components/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LayoutView,
    },
    {
      path: '/EncryptTool',
      name: 'EncryptTool',
      component: EncryptView,
    },
    {
      path: '/CrawlerTool',
      name: 'CrawlerTool',
      component: ()=> import("@/views/CrawlerView.vue"),
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
})

export default router
