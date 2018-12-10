export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
      { path: '/user/callback', component: './User/Callback' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      { path: '/', redirect: 'interview/create-interview/info' },

      {
        path: '/interview',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/interview/create-interview',
            name: 'createinterview',
            component: './Interviews/CreateInterviewForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/interview/create-interview',
                name: 'createinterview',
                redirect: '/interview/create-interview/info',
              },
              {
                path: '/interview/create-interview/info',
                name: 'info',
                component: './Interviews/CreateInterviewForm/Step1',
              },
              {
                path: '/interview/create-interview/confirm',
                name: 'confirm',
                component: './Interviews/CreateInterviewForm/Step2',
              },
              {
                path: '/interview/create-interview/result',
                name: 'result',
                component: './Interviews/CreateInterviewForm/Step3',
              },
            ],
          },
          {
            path: '/interview/view-interviews',
            name: 'viewInterview',
            authority: ['user'],
            component: './Candidates/ViewInterviews',
          },
        
        ],
      },
      {
        path: '/candidates',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/candidates/candidates',
            name: 'searchtable',
            component: './Candidates/Candidates',
          },
        
          {path: '/candidates/view-candidate',
          name: 'viewCandidate',
          authority: ['user'],
          component: './Candidates/ViewCandidate',
          hideInMenu: true,

        }, {path: '/candidates/share-links',
          name: 'shareLinks',
          authority: ['user'],
          component: './Candidates/ShortLists',

        }],
        
      },

      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
