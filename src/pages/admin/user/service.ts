import request from 'umi-request';
import { TableListParams } from './data';


export async function optionRule(method: string, params?: TableListParams) {
  return request('/server/admin/admin/user', {
    method: 'POST',
    data: {
      ...params,
      method: method
    }
  })
}

export async function batchRule(method: string, params: { ids: number[] }) {
  return request('/server/admin/admin/user', {
    method: 'POST',
    data: {
      ...params,
      method: method
    }
  })
}


export async function queryRule(params?: TableListParams) {
  return request('/server/admin/admin/user', {
    params,
  });
}

export async function removeRule(params: { ids: number[] }) {
  return request('/server/admin/admin/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/server/admin/admin/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'add',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/server/admin/admin/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
