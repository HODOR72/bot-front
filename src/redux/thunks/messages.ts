import { dispatch } from '../store';
import { MessagesList } from '../../@types/messages';
import ApiClients from '../../utils/axios';
import { hasError, addMessagesSuccess } from '../slices/messages';

const { axiosBase } = ApiClients;

export function createMessagesThunk(params: any) {
  return async () => {
    try {
      const response: { data: MessagesList } = await axiosBase.get(
        `sendMessages?users=${params.users.join(',')}&message=${params.message}`
      );

      dispatch(addMessagesSuccess(response.data.data));
      return true;
    } catch (error) {
      dispatch(hasError(error));
    }
    return false;
  };
}
