import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

Vue.use(VueRouter)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    name:'Index',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/home/index.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'dashboard',
          // icon: 'el-icon-s-home',
          affix: true
        }
      }
    ]
  },
  {
    path:'/productManage',
    component: Layout,
    redirect: '/productList',
    name: 'ProductManage',
    meta: { title: '商品管理', icon: 'tree',alwaysShow: true },
    children: [
      {
        path: 'productList',
        name: 'ProductList',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '商品列表' }
      },
      {
        path: 'productList1',
        name: 'ProductList1',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '团购活动' }
      },
      {
        path: 'storeActivity',
        name: 'StoreActivity',
        component: () => import('@/views/store-activity/list.vue'),
        meta: { title: '店铺活动' }
      },
      {
        path: 'addActivity',
        name: 'AddActivity',
        component: () => import('@/views/store-activity/detail.vue'),
        meta: { title: '新建活动',hidden:true }
      },
      {
        path: "editActivity",
        name: "EditActivity",
        component: () =>
          import(/* webpackChunkName: "tree" */ "@/views/store-activity/detail.vue"),
        meta: {
          title: "编辑活动",
          hidden: true
        }
      },
      {
        path: "activityDetail",
        name: "ActivityDetail",
        component: () =>
          import(/* webpackChunkName: "tree" */ "@/views/store-activity/detail.vue"),
        meta: {
          title: "活动详情",
          hidden: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

const createRouter = () => new VueRouter({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
