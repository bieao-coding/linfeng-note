import { routerRedux } from 'dva/router';
import { login,getUserInfo } from '../service/loginService';
import { reloadAuthorized } from '@/utils/Authorized';
import info from '@/defaultInfo';

export default {
  namespace: 'login',

  state: {
    status: 0,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response && !response.status) {
        const userInfoRes = yield call(getUserInfo, payload);
        if(!userInfoRes.status && userInfoRes.data){
          info.userInfo = userInfoRes.data;
          yield put(routerRedux.replace('/'));
        }
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
