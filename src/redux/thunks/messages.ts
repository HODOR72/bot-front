import { dispatch } from '../store';
import { MessagesManager } from '../../@types/messages';
import ApiClients from '../../utils/axios';
import { hasError, addMessagesSuccess } from '../slices/messages';

const { axiosBase } = ApiClients;

export function createMessagesThunk(params: any) {
  console.log(params);
  return async () => {
    try {
      const response: { data: { data: MessagesManager } } = await axiosBase.post(
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
