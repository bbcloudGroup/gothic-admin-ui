import request from '@/utils/request';
import { TableListParams } from '@/pages/admin/menu/data';

export async function queryMenu() {
    return request(`/server/admin/api/menu`);
}

export async function queryMenus(params?: TableListParams) {
    return request('/server/admin/api/menus', {
        params,
    });
}
