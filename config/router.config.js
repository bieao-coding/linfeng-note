
export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/note'},
      {
        path:'/platformUser',
        name: 'platformUser',
        hideInMenu:true,
        icon: 'user',
        component: './PlatformUser/PlatformUser'
      },
      {
        path:'/platformUser/form',
        component: './PlatformUser/form/platformUserForm',
      },
      {
        path:'/note',
        name: 'note',
        icon: 'ordered-list',
        component: './Note/Note',
        routes:[
          { path: '/note', redirect: '/note/list'},
          {
            path:'/note/list',
            component: './Note/list/noteList',
          },
          {
            path:'/note/form',
            component: './Note/form/noteForm',
          },
        ]
      },
      {
        path:'/password',
        name: 'password',
        icon: 'lock',
        component: './Password/Password',
      },
      {
        path: '/exception',
        routes: [
          {
            path: '/exception/403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            component: './Exception/500',
          }
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
