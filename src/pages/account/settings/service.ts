import request from 'umi-request';
import { AccountParams } from './data'

export async function queryCurrent() {
  return request('/server/admin/api/account');
  // return request('/api/currentUser');
}


export async function updateAccount(params) {
  return request('/server/admin/api/account', {
    method: 'POST',
    data: {
      ...params
    }
  })
}



export async function updateAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  return request('/server/admin/api/avatar', {
    method: 'POST',
    data: formData
  })
}

export async function updatePassword(params) {
  return request('/server/admin/api/password', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

export async function updatePhone(params) {
  return request('/server/admin/api/phone', {
    method: 'POST',
    data: {
      ...params
    }
  })
}


export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}
