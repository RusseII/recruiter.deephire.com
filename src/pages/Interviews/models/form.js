import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, createInterview } from '@/services/api';

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
      const response = yield call(createInterview, payload);

      yield put({
        type: 'saveStepFormData',
        interviewLink: response,
      });

      yield put(routerRedux.push('/interview/create-interview/result'));
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
