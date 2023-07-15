import { dispatch } from '../store';
import { User, UserListParams } from '../../@types/user';
import ApiClients from '../../utils/axios';
import { startLoading, hasError, getUserListSuccess } from '../slices/user';

const { axiosBase } = ApiClients;

export function getUserListThunk(params: UserListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      let sendedRequests = 0
      let response: { data: User[] } = await axiosBase.get('getUsers', { params });

      // while (response.data.length === 0 && sendedRequests < 3) {
        response = await axiosBase.get('getUsers', { params });
        // sendedRequests++
      // }

      dispatch(getUserListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
      // dispatch(getUserListThunk(params));
    }
  };
}
