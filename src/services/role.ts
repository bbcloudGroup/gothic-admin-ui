import request from '@/utils/request';
import { TableListParams } from '@/pages/admin/menu/data';


export async function queryRoles(params?: TableListParams) {
    return request('/server/admin/api/roles', {
        params,
    });
}
