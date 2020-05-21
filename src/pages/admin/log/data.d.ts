import { List } from "antd";
import { Menu as TableListItem } from "@/pages/admin/menu/data"
import { TableListItem as User } from "@/pages/admin/user/data" 
import { TableListItem as Menu } from "@/pages/admin/user/menu" 

export interface TableListItem {
  id: number;
  data: string;
  user: User;
  menu: Menu;
  method: Menu;
  created_at: Date;
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
}
