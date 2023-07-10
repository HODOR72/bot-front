import { dispatch } from '../store';
import { MessagesList, MessagesListParams, MessagesManager } from '../../@types/messages';
import ApiClients from '../../utils/axios';
import {
  startLoading,
  hasError,
  getMessagesListSuccess,
  getMessagesSuccess,
  addMessagesSuccess,
  editMessagesSuccess, deleteMessagesSuccess,
} from '../slices/messages';

const { axiosBase } = ApiClients

export function getMessagesListThunk(params: MessagesListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: MessagesList } = await axiosBase.get('api/getMessages', { params });
      console.log(response.data)
      dispatch(getMessagesListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getMessagesThunk(id: number) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.get(`api/messages/${id}`);
      dispatch(getMessagesSuccess(response.data.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function createMessagesThunk(params: any) {
  return async () => {
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.post(`api/sendMessages`, params);
      dispatch(addMessagesSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function editMessagesThunk(id: number, params: any) {
  return async () => {
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.put(`api/messages/${id}`, params);
      dispatch(editMessagesSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function deleteMessagesThunk(id: number) {
  return async () => {
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.delete(`api/messages/${id}`);
      dispatch(deleteMessagesSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}
