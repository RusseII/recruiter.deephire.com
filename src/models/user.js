import { query as queryUsers, queryCurrent } from '@/services/user';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
// import { routerRedux } from 'dva/router';
// import { push } from "dva/router"

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } catch {
        console.log('UH OH ERROR');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('profile');

        setAuthority('guest');
        reloadAuthorized();
        // TODO could do this better
        window.location.reload(true);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
