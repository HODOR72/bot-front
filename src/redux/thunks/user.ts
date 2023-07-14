import { dispatch } from '../store';
import { User, UserListParams } from '../../@types/user';
import ApiClients from '../../utils/axios';
import { startLoading, hasError, getUserListSuccess } from '../slices/user';

const { axiosBase } = ApiClients;

export function getUserListThunk(params: UserListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: User[] } = await axiosBase.get('getUsers', { params });
      console.log(response.data);
      dispatch(getUserListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
      dispatch(getUserListThunk(params));
    }
  };
}
