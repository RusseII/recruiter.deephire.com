import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm, createInterview } from '@/services/api';

export default {
  namespace: 'form',

  state: {
    step: {
      payAccount: 'ant-design@alipay.com',
      receiverAccount: 'test@example.com',
      receiverName: 'Alex',
      amount: '500',
    },
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
        payload,
      });
      yield console.log(payload);
      yield put(routerRedux.push('/form/create-interview/result'));
      yield console.log(response);
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
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
