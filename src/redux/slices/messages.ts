import { createSlice } from '@reduxjs/toolkit';
import { MessagesState } from '../../@types/messages';

const initialState: MessagesState = {
  isLoading: false,
  messagesList: {},
  messagesListParams: {},
};

const slice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    resetError(state) {
      state.error = undefined;
    },

    getMessagesListSuccess(state, action) {
      state.isLoading = false;
      state.messagesList = action.payload;
    },

    setMessagesListParams(state, action) {
      state.messagesListParams = action.payload;
    },

    getMessagesSuccess(state, action) {
      state.isLoading = false;
      state.messages = action.payload;
    },

    addMessagesSuccess(state, action) {
      state.messagesList = {
        meta: state.messagesList.meta,
        data: [action.payload, ...(state.messagesList.data || [])],
      };
    },

    editMessagesSuccess(state, action) {
      state.messagesList = {
        meta: state.messagesList.meta,
        data: state.messagesList.data?.map((obj) =>
          obj.id === action.payload.id ? action.payload : obj
        ),
      };
    },

    deleteMessagesSuccess(state, action) {
      state.messagesList = {
        meta: state.messagesList.meta,
        data: state.messagesList.data?.filter((obj) => obj.id !== action.payload.id),
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Messages
export const {
  startLoading,
  hasError,
  resetError,
  getMessagesListSuccess,
  setMessagesListParams,
  getMessagesSuccess,
  addMessagesSuccess,
  editMessagesSuccess,
  deleteMessagesSuccess,
} = slice.actions;
