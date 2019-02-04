export const candidateList = {
  list: [
    {
      _id: {
        $oid: '5c4ca732f2b3768b9ecb4fad',
      },
      candidateEmail: 'russell@deephire.com',
      clicks: ['2019-01-29 22:58:34', '2019-01-29 22:58:34'],
      rating: '2',
      interview: 'no',
      feedback: [
        'Meh seems just okay thats for sure',
        'This intervewi is worse than the last one. SEriously where do you find these iditos',
      ],
      interviewName: 'no_name',
      timestamp: '2018-11-09 16:22:37',
      userId: 'google-oauth2|108316160914067599948',
      userName: 'Russell Ratcliffe',
      responses: [
        {
          question: 'What are three words that describe youtself? And Why?',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question: 'question 2 hahah',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidateEmail: 'emerson@deephire.com',
      interviewName: 'I love interviews2',
      clicks: ['2019-01-29 22:58:34'],
      interview: 'yes',
      feedback: ['Great personality. Good charisma'],
      rating: '5',
      timestamp: '2018-11-09 16:22:37',
      userId: 'google-oauth2|108316160914067599948',
      userName: 'Emerson Clouder',
      responses: [
        {
          question: 'What are three words that describe youtself? And Why?',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question: 'question 2 hahah',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidateEmail: 'emerson@deephire.com',
      clicks: ['2019-01-29 22:58:34', '2019-01-29 22:58:34', 1548954928550],
      rating: '3',
      interview: 'maybe',
      feedback: ["Just okay. I'll interview him if I have to"],
      interviewName: 'I love interviews2',
      timestamp: '2018-11-09 16:22:37',
      userId: 'google-oauth2|108316160914067599948',
      userName: 'Emerson Clouder',
      responses: [
        {
          question: 'What are three words that describe youtself? And Why?',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question: 'question 2 hahah',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidateEmail: 'emerson@deephire.com',
      clicks: [],
      interviewName: 'I love interviews2',
      timestamp: '2018-11-09 16:22:37',
      userId: 'google-oauth2|108316160914067599948',
      userName: 'Emerson Clouder',
      responses: [
        {
          question: 'What are three words that describe youtself? And Why?',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question: 'question 2 hahah',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
    {
      _id: {
        $oid: 'otherid',
      },
      candidateEmail: 'emerson@deephire.com',
      clicks: ['2019-01-29 22:58:34', '2019-01-29 22:58:34', 1548954928550],
      rating: '5',
      interview: 'yes',
      interviewName: 'I love interviews2',
      timestamp: '2018-11-09 16:22:37',
      userId: 'google-oauth2|108316160914067599948',
      userName: 'Emerson Clouder',
      responses: [
        {
          question: 'What are three words that describe youtself? And Why?',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
        {
          question: 'question 2 hahah',
          response: 'https://vimeo.com/299965218/3f595787a6',
        },
      ],
    },
  ],
};

export const shortLists = [
  {
    _id: {
      $oid: '5c51a3867cebba00081dc71c',
    },
    created_by: 'russell@deephire.com',
    name: 'Hiring Manager',
    email: 'hiringmanager@goog.com',
    clicks: ['2019-01-29 22:58:34'],
    link: 'https://google.com',
    hideInfo: false,
    interviews: candidateList.list,
  },
  {
    _id: {
      $oid: '5c51a3867cebba00081dc71c',
    },
    created_by: 'russell@deephire.com',
    name: 'Aother GOober',
    email: 'goober@goog.com',
    clicks: ['2019-01-29 22:58:34', '2019-01-29 22:58:34', 1548954928550],
    link: 'https://google.com',
    hideInfo: false,
    interviews: candidateList.list,
  },
];

export const shortListsWithAnalytics = {
  // what do you think makes sense for the analytics to be stored as?
  clicks: ['2019-01-29 22:58:34', '2019-01-29 22:58:34', 1548954928550],
  shortUrl: 'https://google.com',
  _id: {
    $oid: '5c51a3867cebba00081dc71c',
  },
  created_by: 'russell@deephire.com',
  email: 'hiringmanager@goog.com',
  hideInfo: false,
  list: candidateList.list,
};
