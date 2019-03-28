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
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'index-nav',
            name: 'index-nav',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/IndexNav'], resolve)
        },
        {
            path: 'index-shuffling-figures',
            name: 'index-shuffling-figures',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/IndexShufflingFigure'], resolve)
        },
        {
            path: 'index-block',
            name: 'index-block',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/IndexBlock'], resolve)
        }
      ]
    },
    {
      path: '/goods-management',
      name: 'goods-management',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'category-list',
            name: 'category-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/CategoryList'], resolve)
        },
        {
            path: 'goods-list',
            name: 'goods-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/GoodsList'], resolve)
        }
      ]
    },
    {
      path: '/order-management',
      name: 'order-management',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'order-list',
            name: 'order-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/OrderList'], resolve)
        }
      ]
    },
    {
      path: '/comment-management',
      name: 'comment-management',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'comment-list',
            name: 'comment-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/CommentList'], resolve)
        }
      ]
    },
    {
      path: '/user-management',
      name: 'user-management',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'user-list',
            name: 'user-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/UserList'], resolve)
        }
      ]
    },
    {
      path: '/admin-management',
      name: 'admin-management',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'admin-list',
            name: 'admin-list',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/AdminList'], resolve)
        }
      ]
    },
    {
      path: '/statistics',
      name: 'statistics',
      meta: {
          // 添加该字段，表示进入这个路由是需要登录的
          requireAuth: true,
      },
      component: resolve => require(['@/pages/index'], resolve),
      children: [
        {
            path: 'sales-statistics',
            name: 'sales-statistics',
            meta: {
                // 添加该字段，表示进入这个路由是需要登录的
                requireAuth: true,
            },
            component: resolve => require(['@/components/Statistics'], resolve)
        }
      ]
    }
  ]
})
