import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, createInterview, shareShortLink } from '@/services/api';

export default {
  namespace: 'form',

  state: {
    step: {},
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      // createInterview("test").then(x => console.log(x))
      const response = yield call(createInterview, payload);
      console.log(response);
      // response = `https://interview.deephire.com/pickInterview/${encodeURIComponent(response)}`;

      yield put({
        type: 'saveStepFormData',
        interviewLink: response,
      });

      yield put(routerRedux.push('/interview/create-interview/result'));
      yield console.log(response);
    },
    *share({ payload, callback }, { call, put }) {
      console.log('share rule.js');

      const response = yield call(shareShortLink, payload);
      console.log(response, 'ZZZZZZZZZZZZZ');

      yield put({
        type: 'saveStepFormData',
        shareLink: response,
      });
      if (callback) callback();
    },
    *submitviewInterview({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, payload) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
