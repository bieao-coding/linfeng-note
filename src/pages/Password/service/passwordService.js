/*eslint-disable*/
import { stringify } from 'qs';
import request from '@/utils/request';
const baseUrl = '/restful/v1/users';

/*编辑密码*/
export async function editPassword(params) {
  return request(`${baseUrl}/${params.userId}/password`, {
    method: 'PUT',
    body: {
      ...params
    },
  });
}
