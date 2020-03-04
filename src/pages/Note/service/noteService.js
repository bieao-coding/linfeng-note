/*eslint-disable*/
import { stringify } from 'qs';
import request from '@/utils/request';
const baseUrl = '/restful/v1/works';
const userUrl = '/restful/v1/users';

/*获取用户列表*/
export async function getUsers(params) {
  return request(`${userUrl}?${stringify(params)}`);
}

/*获取日志列表*/
export async function getNotes(params) {
  return request(`${baseUrl}?${stringify(params)}`);
}
/*获取单个日志信息*/
export async function getNoteById(entryId) {
  return request(`${baseUrl}/${entryId}`);
}
/*添加日志*/
export async function addNote(params) {
  return request(`${baseUrl}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*编辑日志*/
export async function editNote(params) {
  return request(`${baseUrl}/${params.entryId}`, {
    method: 'PUT',
    body: {
      ...params
    },
  });
}
