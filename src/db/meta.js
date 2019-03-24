export default {
  menu: [
    {
      id: 1,
      icon: 'ios-briefcase',
      name: '商城内容管理',
      menuItems: [
        {
          id: 11,
          name: '首页导航栏管理',
          link: '/index-content/index-nav'
        },
        {
            id: 12,
            name: '首页轮播图管理',
            link: '/index-content/index-shuffling-figures'
        },
        {
          id: 13,
          name: '首页板块内容管理',
          link: '/index-content/index-block'
        }
      ]
    },
    {
      id: 2,
      icon: 'ios-basket',
      name: '商品管理',
      menuItems: [
        {
          id: 21,
          name: '分类管理',
          link: '/goods-management/category-list'
        },
        {
          id: 22,
          name: '商品列表',
          link: '/goods-management/goods-list'
        }
      ]
    },
    {
      id: 3,
      icon: 'ios-paper',
      name: '订单管理',
      menuItems: [
        {
          id: 31,
          name: '订单列表',
          link: '/order-management/order-list'
        }
      ]
    },
    {
      id: 4,
      icon: 'md-thumbs-up',
      name: '评论管理',
      menuItems: [
        {
          id: 41,
          name: '评论列表',
          link: '/comment-management/comment-list'
        }
      ]
    },
    {
      id: 5,
      icon: 'ios-body',
      name: '用户管理',
      menuItems: [
        {
          id: 51,
          name: '用户列表',
          link: '/user-management/user-list'
        }
      ]
    },
    {
      id: 6,
      icon: 'ios-people',
      name: '管理员管理',
      menuItems: [
        {
          id: 61,
          name: '管理员列表',
          link: '/admin-management/admin-list'
        }
      ]
    },
    {
      id: 7,
      icon: 'md-trending-up',
      name: '统计报表',
      menuItems: [
        {
          id: 71,
          name: '订单销量统计',
          link: '/statistics/sales-statistics'
        }
      ]
    }
  ]
}
