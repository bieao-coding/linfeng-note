/*eslint-disable*/
import {getAuth,getUserInfo} from "../service/user";
import { reloadAuthorized } from '@/utils/Authorized';
import { routerRedux } from 'dva/router';
import info from '@/defaultInfo'
export  default{
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *getUserInfo({ payload,callback }, { call }) {
      const response = yield call(getUserInfo,payload);
      if (callback && !!response) callback(response);
    },
    *logout({ payload }, { call, put }){
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    }
  },

  reducers: {

  },
};
