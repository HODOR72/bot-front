import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../@types/user';

const initialState: UserState = {
  isLoading: false,
  userList: {},
  userListParams: {},
};

const slice = createSlice({
  name: 'user',
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

    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.userList = action.payload;
    },

    setUserListParams(state, action){
      state.userListParams = action.payload;
    },

    getUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },

    addUserSuccess(state, action) {
      state.userList = {
        meta: state.userList.meta,
        data: [action.payload, ...state.userList.data || []]
      }
    },

    editUserSuccess(state, action) {
      state.userList = {
        meta: state.userList.meta,
        data: state.userList.data?.map(obj => obj.id === action.payload.id ? action.payload : obj)
      }
    },

    deleteUserSuccess(state, action) {
      state.userList = {
        meta: state.userList.meta,
        data: state.userList.data?.filter(obj => obj.id !== action.payload.id)
      }
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading, hasError, resetError, getUserListSuccess, setUserListParams,
  getUserSuccess, addUserSuccess, editUserSuccess, deleteUserSuccess
} = slice.actions;

