import { List } from "antd";
import { TableListItem as Role } from "@/pages/admin/roles/data"

export interface TableListItem {
  id: number;
  name: string;
  avatar: string;
  mail: string;
  mobile: string;
  password: string;
  created_at: Date;
  status: bool;
  roles: Role[];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id?: number;
  mail?: string;
  mobile?: string;
  password?: string;
  name?: string;
  roles?: Role[];
}
