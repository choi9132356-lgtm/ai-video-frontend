import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 🎯 [수정] App.vue를 직접 import하는 대신, 빈 템플릿을 연결하여
      // 최상위 App.vue의 기본 레이아웃과 화면이 로그인 체크 없이 그대로 뜨게 만듭니다.
      component: { template: '<div></div>' }
    },
    // 🎯 [신규 추가] 쇼케이스 뷰를 Lazy Loading 방식으로 안전하게 등록합니다.
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('../views/ShowcaseView.vue')
    },
    {
      path: '/process',
      name: 'process',
      component: () => import('../views/ProcessView.vue')
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    },
    {
      path: '/my-orders',
      name: 'my-orders',
      component: () => import('../views/MyOrdersView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      // 💡 기존에 쓰시던 실제 관리자 대시보드 파일 하나로 통합합니다.
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/test',
      name: 'dev-test',
      component: () => import('../views/DevTestView.vue')
    }
    // 🚨 맨 밑에 중복되어 충돌을 일으키던 '/admin' (AdminDashboard) 경로는 깔끔하게 삭제했습니다!
  ]
})

export default router