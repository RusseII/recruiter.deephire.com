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

  { path: '/shortlists/shortlistanalytics', redirect: '/sharelinks' },

  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      { path: '/', redirect: 'one-way/candidates' },
      {
        icon: 'laptop',
        path: '/one-way/',
        name: 'One-Way Interviews',
        routes: [
          {
            path: '/one-way/jobs/',
            icon: 'coffee',
            name: 'Jobs',
            authority: ['admin', 'user'],
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/one-way/jobs/',
                name: 'Create New Interview',
                component: './Candidates/ViewInterviews',
              },
              {
                path: '/one-way/jobs/analytics/',
                name: 'Job Analytics',
                authority: ['admin', 'user'],
                component: './Candidates/CandidateAnalytics',
              },
              {
                path: '/one-way/jobs/create/',
                name: 'Create New Interview',
                component: './Interviews/CreateInterviewForm',

                routes: [
                  {
                    path: '/one-way/jobs/create/info/',
                    name: 'Create',
                    component: './Interviews/CreateInterviewForm/Step1',
                  },

                  {
                    path: '/one-way/jobs/create/result/',
                    name: 'Success',
                    component: './Interviews/CreateInterviewForm/Step3',
                  },
                ],
              },
            ],
          },
          {
            path: '/one-way/candidates/',
            icon: 'team',
            name: 'Candidates',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/one-way/candidates/',
                icon: 'team',
                name: 'Candidates',
                component: './Candidates/Candidates',
              },
              {
                path: '/one-way/candidates/candidate/',
                name: 'Candidate',
                authority: ['admin', 'user'],
                component: './Candidates/ViewCandidate',
              },
            ],
          },
        ],
      },

      {
        path: '/live-interviews',
        name: 'Live Interviews',
        authority: ['admin', 'user'],
        icon: 'video-camera',
        component: './LiveInterviews/LiveInterviews',
      },

      {
        path: '/sharelinks',
        icon: 'link',
        name: 'Share Links',
        authority: ['admin', 'user'],
        hideChildrenInMenu: true,

        routes: [
          {
            path: '/sharelinks',
            name: 'Share Links',
            component: './ShortLists/ShortLists',
          },
          {
            path: '/sharelinks/analytics',
            name: 'Share Link Analytics',
            component: './ShortLists/ShortListAnalytics',
          },
        ],
      },

      {
        path: '/billing/',
        icon: 'credit-card',
        name: 'Billing',
        component: './Billing/index',
        authority: ['admin'],
      },
      {
        path: '/billing/plans',
        component: './Billing/BillingCards',
      },
      {
        name: 'Account',
        icon: 'user',
        path: '/account/',
        component: './Account/Settings/Info',
        authority: ['admin'],

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
            path: '/account/settings/users',
            component: './Account/Settings/UserSettings',
          },
          {
            path: '/account/settings/teams',
            component: './Account/Settings/TeamSettings',
          },
          {
            path: '/account/settings/integrations',
            component: './Account/Settings/IntegrationSettings',
          },
          // {
          //   authority: ['admin'],
          //   path: '/account/settings/billing',
          //   component: './Account/Settings/BillingSettings',
          // },
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
        path: '/analytics/',
        name: 'Analytics',
        component: './Analytics',
        authority: ['admin'],
        icon: 'pieChart',
      },
      {
        component: '404',
      },
    ],
  },
];
