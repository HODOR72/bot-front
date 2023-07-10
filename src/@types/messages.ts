// ----------------------------------------------------------------------
import { CommonState, ListParams, Pagination } from './common';

export const USER_PERMISSIONS = [
  {name: 'edit messages', title: 'Управление пользователями'},
  {name: 'test', title: 'Тестовые права'}
]

export type MessagesPermission = {
  id: number;
  name: string;
  title?: string;
}

export type Messages = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  active: boolean;
  permissions: MessagesPermission[];
};

export type MessagesManager = Messages;

export type MessagesList = {
  data?: Messages[];
  meta?: Pagination;
}

export type MessagesListParams = ListParams & {
  name?: string;
  permission?: string;
  active?: boolean;
}

export type MessagesState = CommonState & {
  messages?: MessagesManager;
  messagesList: MessagesList;
  messagesListParams: MessagesListParams;
};

