import {
  getInterviews,
  getVideos,
  removeRule,
  addRule,
  updateRule,
  shareShortLink,
  removeInterview,
} from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      let response = yield call(getVideos, payload);
      response.forEach((resp, index) => {
        response[index].key = index;
      });
      response = { list: response };

      yield put({
        type: 'save',
        payload: response,
      });
    },
    *share({ payload, callback }, { call, put }) {
      const response = yield call(shareShortLink, payload);

      yield put({
        type: 'shareLink',
        payload: response.shortUrl,
      });
      if (callback) callback();
    },

    // eslint-disable-next-line no-unused-vars
    *view_interviews({ thisVariableDoesNothingButErrorsOnRemove }, { call, put }) {
      let response = yield call(getInterviews);
      response = { list: response };

      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    // *removeCandidate({ payload, callback }, { call, put }) {
    //   let response = yield call(removeCandidate, payload);
    //   response.forEach((resp, index) => {
    //     response[index].key = index;
    //   });
    //   response = { list: response };

    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },

    *removeInterview({ payload, callback }, { call, put }) {
      let response = yield call(removeInterview, payload);
      response.forEach((resp, index) => {
        response[index].key = index;
      });
      response = { list: response };

      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    shareLink(state, action) {
      return {
        ...state,
        shareLink: action.payload,
      };
    },
  },
};
