/*eslint-disable*/
import { getNotes,addNote,editNote,getNoteById,getUsers} from '../service/noteService';
export  default{
  namespace: 'note',

  state: {
    list: [],
    total: 0
  },

  effects: {
    *fetch({ payload,callback }, { call, put }) {
      const response = yield call(getNotes,payload);
      if (callback && !!response) callback(response.data);
    },
    *getUsers({ payload,callback }, { call, put }) {
      const response = yield call(getUsers, payload);
      if (callback && !!response) callback(response.data);
    },
    *getEdit({ payload,callback }, { call, put }) {
      const response = yield call(getNoteById, payload);
      if (callback && !!response) callback(response.data);
    },
    *add({ payload,callback }, { call }) {
      const response =  yield call(addNote, payload);
      if (callback) callback(response);
    },
    *edit({ payload,callback }, { call }) {
      const response =  yield call(editNote, payload);
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
