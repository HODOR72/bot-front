import { dispatch } from '../store';
import { UserListParams, UserManager } from '../../@types/user';
import ApiClients from '../../utils/axios';
import { startLoading, hasError, getUserListSuccess, getUserSuccess } from '../slices/user';

const { axiosBase } = ApiClients;

export function getUserListThunk(params: UserListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: any = await axiosBase.get('getUsers', { params });
      console.log(response.data);
      dispatch(getUserListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
