import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const finance: RouteConfig = {
  path: '/financeManager',
  component: Layout,
  redirect: '/financeTotal',
  name: 'FinanceManager',
  meta: {
    title: '财务管理',
    icon: 'chart',
    alwaysShow: true
  },
  children: [
    {
      path: 'financeTotal',
      name: 'FinanceTotal',
      component: () => import('@/views/finance/index.vue'),
      meta: { title: '对账首页' }
    },
    {
      path: 'financeDetail',
      name: 'FinanceDetail',
      component: () => import('@/views/finance/detail.vue'),
      meta: { title: '账单信息',hidden:true }
    }
  ]
}

export default finance
