/*eslint-disable*/
import {editPassword} from '../service/passwordService';
export  default{
  namespace: 'password',

  state: {
    list: [],
    total: 0
  },

  effects: {
    *passwordEdit({ payload,callback }, { call }) {
      const response =  yield call(editPassword, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    getList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};
