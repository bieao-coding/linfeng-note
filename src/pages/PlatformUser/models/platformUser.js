/*eslint-disable*/
import {getUsers,getUserById,addUser,editUser,resetPassword} from '../service/platformUserService';
export  default{
  namespace: 'platformUser',

  state: {
    list: []
  },

  effects: {
    *fetch({payload,callback}, { call, put }) {
      const response = yield call(getUsers,payload);
      if (callback && !!response) callback(response.data);
    },
    *getEdit({ payload,callback }, { call }) {
      const response = yield call(getUserById, payload);
      if (callback && !!response) callback(response.data);
    },
    *add({ payload,callback }, { call }) {
      const response =  yield call(addUser, payload);
      if (callback) callback(response);
    },
    *edit({ payload,callback }, { call }) {
      const response =  yield call(editUser, payload);
      if (callback) callback(response);
    },
    *resetPassword({ payload,callback }, { call }){
      const response =  yield call(resetPassword, payload);
      if (callback) callback(response);
    }
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
