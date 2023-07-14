import { dispatch } from '../store';
import { MessagesManager } from '../../@types/messages';
import ApiClients from '../../utils/axios';
import { hasError, addMessagesSuccess } from '../slices/messages';

const { axiosBase } = ApiClients;

export function createMessagesThunk(params: any) {
  return async () => {
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.get(
        `sendMessages`,
        params
      );
      dispatch(addMessagesSuccess(response.data.data));
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  };
}
