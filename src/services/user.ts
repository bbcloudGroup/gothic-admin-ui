import request from '@/utils/request';
import { TableListParams } from '@/pages/admin/user/data'

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/server/admin/api/current');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function queryUsers(params?: TableListParams) {
  return request('/server/admin/api/users', {
    params,
  });
}