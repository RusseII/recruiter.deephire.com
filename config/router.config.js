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
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: 'candidates/candidates' },

      {
        icon: 'form',

        path: '/interview/create-interview',
        name: 'Create New Interview',
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
            name: 'Create',
            component: './Interviews/CreateInterviewForm/Step1',
          },

          {
            path: '/interview/create-interview/result',
            name: 'Success',
            component: './Interviews/CreateInterviewForm/Step3',
          },
        ],
      },
      {
        path: '/interview/view',
        icon: 'read',
        name: 'View Created Interviews',
        authority: ['admin', 'user'],
        component: './Candidates/ViewInterviews',
      },
      {
        path: '/candidates/candidates',
        icon: 'team',
        name: 'Candidate Videos',
        component: './Candidates/Candidates',
      },
      {
        path: '/candidates/view-candidate',
        name: 'viewCandidate',
        authority: ['admin', 'user'],
        component: './Candidates/ViewCandidate',
        hideInMenu: true,
      },
      {
        path: '/shortlists',
        icon: 'link',
        name: 'Share Links',
        component: './ShortLists/ShortLists',
      },
      {
        path: '/shortlists/shortlistanalytics',
        name: 'shortListAnalytics',
        authority: ['admin', 'user'],
        component: './ShortLists/ShortListAnalytics',
        hideInMenu: true,
      },

      {
        name: 'Account',
        icon: 'user',
        path: '/account/settings',
        component: './Account/Settings/Info',

        routes: [
          {
            path: '/account/settings',
            redirect: '/account/settings/base',
          },
          {
            path: '/account/settings/base',
            component: './Account/Settings/CompanyBranding',
          },
          {
            path: '/account/settings/team',
            component: './Account/Settings/TeamSettings',
          },
          {
            path: '/account/settings/integrations',
            component: './Account/Settings/IntegrationSettings',
          },
          {
            authority: ['admin'],
            path: '/account/settings/billing',
            component: './Account/Settings/BillingSettings',
          },
          {
            path: '/account/settings/notification',
            component: './Account/Settings/NotificationView',
          },
          {
            path: '/account/settings/basic',
            component: './Account/Settings/BaseView',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
