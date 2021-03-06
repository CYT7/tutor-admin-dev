import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },
  {
    path: '/personal',
    component: Layout,
    redirect: '/personal',
    children: [{
      path: '/personal',
      name: 'Personal',
      component: () => import('@/views/personal/index'),
      meta: { title: '个人中心', icon: 'dashboard' },
      hidden: true
    }]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/user/teacher'),
        meta: { title: '老师管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category',
    children: [
      {
        path: '/category',
        name: 'category',
        component: () => import('@/views/category/index'),
        meta: { title: '分类管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/appoint',
    component: Layout,
    redirect: '/appoint',
    children: [
      {
        path: '/appoint',
        name: 'appoint',
        component: () => import('@/views/appoint/index'),
        meta: { title: '预约管理', icon: 'time' }
      }
    ]
  },
  {
    path: '/need',
    component: Layout,
    redirect: '/need',
    children: [
      {
        path: '/need',
        name: 'need',
        component: () => import('@/views/need/index'),
        meta: { title: '需求管理', icon: 'order' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin',
    children: [
      {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/index'),
        meta: { title: '系统管理人员', icon: 'set' }
      }
    ]
  },
  {
    path: '/banner',
    component: Layout,
    redirect: '/banner',
    children: [
      {
        path: '/banner',
        name: 'banner',
        component: () => import('@/views/banner/index'),
        meta: { title: '轮播图管理', icon: 'banner' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'http://localhost:8080/#/',
        meta: { title: '前台网站', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
