// ----------------------------------------------------------------------
import { CommonState, ListParams, Pagination } from './common';

export const USER_PERMISSIONS = [
  {name: 'edit actions', title: 'Управление пользователями'},
  {name: 'test', title: 'Тестовые права'}
]

export type ActionsPermission = {
  id: number;
  name: string;
  title?: string;
}

export type Actions = {
  id: number;
  userId: number;
  phone: number;
  order: string;
  date: string;
  permissions: ActionsPermission[];
};

export type ActionsManager = Actions;

export type ActionsList = {
  data?: Actions[];
  meta?: Pagination;
}

export type ActionsListParams = ListParams & {
  name?: string;
  permission?: string;
  active?: boolean;
}

export type ActionsState = CommonState & {
  actions?: ActionsManager;
  actionsList: ActionsList;
  actionsListParams: ActionsListParams;
};

