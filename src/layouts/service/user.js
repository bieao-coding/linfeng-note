/*eslint-disable*/
import request from '@/utils/request';
const baseUrl = '/restful/v1/login';
/*获取用户信息*/
export async function getUserInfo() {
  return request(`${baseUrl}`);
}
