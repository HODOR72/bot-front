import { dispatch } from '../store';
import { ActionsList, ActionsListParams, ActionsManager } from '../../@types/actions';
import ApiClients from '../../utils/axios';
import {
  startLoading,
  hasError,
  getActionsListSuccess,
  getActionsSuccess,
  addActionsSuccess,
  editActionsSuccess, deleteActionsSuccess,
} from '../slices/actions';

const { axiosBase } = ApiClients

export function getActionsListThunk(params: ActionsListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: ActionsList } = await axiosBase.get('api/getActions', { params });
      console.log(response.data)
      dispatch(getActionsListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getActionsThunk(id: number) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: { data: ActionsManager } } = await axiosBase.get(`api/actions/${id}`);
      dispatch(getActionsSuccess(response.data.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function createActionsThunk(params: any) {
  return async () => {
    try {
      const response: { data: { data: ActionsManager } } = await axiosBase.post(`api/actions`, params);
      dispatch(addActionsSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function editActionsThunk(id: number, params: any) {
  return async () => {
    try {
      const response: { data: { data: ActionsManager } } = await axiosBase.put(`api/actions/${id}`, params);
      dispatch(editActionsSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function deleteActionsThunk(id: number) {
  return async () => {
    try {
      const response: { data: { data: ActionsManager } } = await axiosBase.delete(`api/actions/${id}`);
      dispatch(deleteActionsSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}
