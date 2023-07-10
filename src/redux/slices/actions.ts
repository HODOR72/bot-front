import { createSlice } from '@reduxjs/toolkit';
import { ActionsState } from '../../@types/actions';

const initialState: ActionsState = {
  isLoading: false,
  actionsList: {},
  actionsListParams: {},
};

const slice = createSlice({
  name: 'actions',
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

    getActionsListSuccess(state, action) {
      state.isLoading = false;
      state.actionsList = action.payload;
    },

    setActionsListParams(state, action){
      state.actionsListParams = action.payload;
    },

    getActionsSuccess(state, action) {
      state.isLoading = false;
      state.actions = action.payload;
    },

    addActionsSuccess(state, action) {
      state.actionsList = {
        meta: state.actionsList.meta,
        data: [action.payload, ...state.actionsList.data || []]
      }
    },

    editActionsSuccess(state, action) {
      state.actionsList = {
        meta: state.actionsList.meta,
        data: state.actionsList.data?.map(obj => obj.id === action.payload.id ? action.payload : obj)
      }
    },

    deleteActionsSuccess(state, action) {
      state.actionsList = {
        meta: state.actionsList.meta,
        data: state.actionsList.data?.filter(obj => obj.id !== action.payload.id)
      }
    }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading, hasError, resetError, getActionsListSuccess, setActionsListParams,
  getActionsSuccess, addActionsSuccess, editActionsSuccess, deleteActionsSuccess
} = slice.actions;

