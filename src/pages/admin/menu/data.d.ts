import { List } from "antd";

export interface TableListItem {
  id: number;
  name: string;
  tag: string;
  type: number;
  parent_id: number;
  children: TableListItem[]
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
  type?: number;
  parent_id?: number;
  children?: TableListItem[];
}
