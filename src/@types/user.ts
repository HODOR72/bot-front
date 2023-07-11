// ----------------------------------------------------------------------
import { CommonState, ListParams, Pagination } from './common';

export const USER_PERMISSIONS = [
  { name: 'edit users', title: 'Управление пользователями' },
  { name: 'test', title: 'Тестовые права' },
];

export type UserPermission = {
  id: number;
  name: string;
  title?: string;
};

export type User = {
  name: string;
  nickname: string;
  phone: number;
  surname: string;
  userId: number;
};

export type UserManager = User;

export type UserListParams = ListParams & {
  name?: string;
  permission?: string;
  active?: boolean;
};

export type UserState = CommonState & {
  user?: UserManager;
  userList: any;
  userListParams: UserListParams;
};
