import { dispatch } from '../store';
import { UserList, UserListParams, UserManager } from '../../@types/user';
import ApiClients from '../../utils/axios';
import {
  startLoading,
  hasError,
  getUserListSuccess,
  getUserSuccess,
  addUserSuccess,
  editUserSuccess, deleteUserSuccess,
} from '../slices/user';

const { axiosBase } = ApiClients

export function getUserListThunk(params: UserListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: UserList } = await axiosBase.get('api/v1/users', { params });
      dispatch(getUserListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function getUserThunk(id: number) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: { data: UserManager } } = await axiosBase.get(`api/v1/users/${id}`);
      dispatch(getUserSuccess(response.data.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}

export function createUserThunk(params: any) {
  return async () => {
    try {
      const response: { data: { data: UserManager } } = await axiosBase.post(`api/v1/users`, params);
      dispatch(addUserSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function editUserThunk(id: number, params: any) {
  return async () => {
    try {
      const response: { data: { data: UserManager } } = await axiosBase.put(`api/v1/users/${id}`, params);
      dispatch(editUserSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}

export function deleteUserThunk(id: number) {
  return async () => {
    try {
      const response: { data: { data: UserManager } } = await axiosBase.delete(`api/v1/users/${id}`);
      dispatch(deleteUserSuccess(response.data.data))
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  }
}
