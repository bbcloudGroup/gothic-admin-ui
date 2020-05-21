import { List } from "antd";
import { Menu as TableListItem } from "@/pages/admin/menu/data"

export interface TableListItem {
  id: number;
  name: string;
  tag: string;
  menus: Menu[];
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
  tag?: string;
  name?: string;
  menus: string[];
}
