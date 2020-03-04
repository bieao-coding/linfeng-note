/*eslint-disable*/
import { stringify } from 'qs';
import request from '@/utils/request';
const baseUrl = '/restful/v1/users';

/*获取用户列表*/
export async function getUsers(params) {
  return request(`${baseUrl}?${stringify(params)}`);
}

/*获取单个用户信息*/
export async function getUserById(userId) {
  return request(`${baseUrl}/${userId}`);
}
/*添加用户*/
export async function addUser(params) {
  return request(`${baseUrl}`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
/*编辑用户*/
export async function editUser(params) {
  return request(`${baseUrl}/${params.userId}`, {
    method: 'PUT',
    body: {
      ...params
    },
  });
}
export async function resetPassword(userId){
  return request(`${baseUrl}/${userId}/resetPassword`, {
    method: 'PUT'
  });
}
