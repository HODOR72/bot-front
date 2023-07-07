// ----------------------------------------------------------------------
import { CommonState, ListParams, Pagination } from './common';

export const USER_PERMISSIONS = [
  {name: 'edit users', title: 'Управление пользователями'},
  {name: 'test', title: 'Тестовые права'}
]

export type UserPermission = {
  id: number;
  name: string;
  title?: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  active: boolean;
  permissions: UserPermission[];
};

export type UserManager = User;

export type UserList = {
  data?: User[];
  meta?: Pagination;
}

export type UserListParams = ListParams & {
  name?: string;
  permission?: string;
  active?: boolean;
}

export type UserState = CommonState & {
  user?: UserManager;
  userList: UserList;
  userListParams: UserListParams;
};

