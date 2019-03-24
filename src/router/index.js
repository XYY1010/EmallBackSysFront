import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: resolve => require(['@/pages/login'], resolve)
    },
    {
      path: '/index-content',
      name: 'index-content',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'index-nav',
            name: 'index-nav',
            component: resolve => require(['@/components/IndexNav'], resolve)
        },
        {
            path: 'index-shuffling-figures',
            name: 'index-shuffling-figures',
            component: resolve => require(['@/components/IndexShufflingFigure'], resolve)
        },
        {
            path: 'index-block',
            name: 'index-block',
            component: resolve => require(['@/components/IndexBlock'], resolve)
        }
      ]
    },
    {
      path: '/goods-management',
      name: 'goods-management',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'category-list',
            name: 'category-list',
            component: resolve => require(['@/components/CategoryList'], resolve)
        },
        {
            path: 'goods-list',
            name: 'goods-list',
            component: resolve => require(['@/components/GoodsList'], resolve)
        }
      ]
    },
    {
      path: '/order-management',
      name: 'order-management',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'order-list',
            name: 'order-list',
            component: resolve => require(['@/components/OrderList'], resolve)
        }
      ]
    },
    {
      path: '/comment-management',
      name: 'comment-management',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'comment-list',
            name: 'comment-list',
            component: resolve => require(['@/components/CommentList'], resolve)
        }
      ]
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'user-list',
            name: 'user-list',
            component: resolve => require(['@/components/UserList'], resolve)
        }
      ]
    },
    {
      path: '/admin-management',
      name: 'admin-management',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'admin-list',
            name: 'admin-list',
            component: resolve => require(['@/components/AdminList'], resolve)
        }
      ]
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'sales-statistics',
            name: 'sales-statistics',
            component: resolve => require(['@/components/Statistics'], resolve)
        }
      ]
    }
  ]
})
