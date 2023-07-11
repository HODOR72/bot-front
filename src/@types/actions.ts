// ----------------------------------------------------------------------
import { CommonState, ListParams, Pagination } from './common';

export type Actions = {
  id: number;
  userId: number;
  phone: number;
  order: string;
  date: string;
};

export type ActionsManager = Actions;

export type ActionsList = {
  data?: Actions[];
  meta?: Pagination;
};

export type ActionsListParams = ListParams & {
  name?: string;
  permission?: string;
  active?: boolean;
};

export type ActionsState = CommonState & {
  actions?: ActionsManager;
  actionsList: any;
  actionsListParams: ActionsListParams;
};
