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
      // createInterview("test").then(x => console.log(x))
      const response = yield call(createInterview, payload);
      console.log(response);
      // response = `https://interview.deephire.io/pickInterview/${encodeURIComponent(response)}`;

      yield put({
        type: 'saveStepFormData',
        interviewLink: response,
      });

      yield put(routerRedux.push('/form/create-interview/result'));
      yield console.log(response);
    },
    *submitAdvancedForm({ payload }, { call }) {
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
