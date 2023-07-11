import { dispatch } from '../store';
import { ActionsList, ActionsListParams } from '../../@types/actions';
import ApiClients from '../../utils/axios';
import { startLoading, hasError, getActionsListSuccess } from '../slices/actions';

const { axiosBase } = ApiClients;

export function getActionsListThunk(params: ActionsListParams) {
  return async () => {
    dispatch(startLoading());
    try {
      const response: { data: ActionsList } = await axiosBase.get('getActions', { params });
      console.log(response.data);
      dispatch(getActionsListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };
}
