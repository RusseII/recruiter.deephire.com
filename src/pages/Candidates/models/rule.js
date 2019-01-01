import {
  getInterviews,
  queryRule2,
  removeRule,
  addRule,
  updateRule,
  shareShortLink,
  removeInterview,
  removeCandidate,
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
      console.log('payload', payload);

      let response = yield call(queryRule2, payload);
      console.log(response);
      response.forEach((resp, index) => {
        response[index].key = index;
      });
      response = { list: response };
      console.log(response);

      yield put({
        type: 'save',
        payload: response,
      });
    },
    *share({ payload, callback }, { call, put }) {
      console.log('share rule.js');

      const response = yield call(shareShortLink, payload);
      console.log(response, 'ZZZZZZZZZZZZZ');

      yield put({
        type: 'shareLink',
        payload: response,
      });
      if (callback) callback();
    },

    *view_interviews({ payload }, { call, put }) {
      console.log('payload', payload);

      let response = yield call(getInterviews, payload);
      console.log(response);
      response = { list: response };
      console.log(response);

      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      console.log('add rule.js');

      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *removeCandidate({ payload, callback }, { call, put }) {
      console.log('remove rule.js');
      console.log(payload);
      let response = yield call(removeCandidate, payload);
      console.log(response);
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

    *removeInterview({ payload, callback }, { call, put }) {
      console.log('remove rule.js');
      console.log(payload);
      let response = yield call(removeInterview, payload);
      console.log(response);
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
      console.log('remove rule.js');

      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      console.log('update rule.js');
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
