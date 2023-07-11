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

    setActionsListParams(state, action) {
      state.actionsListParams = action.payload;
    },

    getActionsSuccess(state, action) {
      state.isLoading = false;
      state.actions = action.payload;
    },

    addActionsSuccess(state, action) {
      state.actionsList = {
        meta: state.actionsList.meta,
        data: [action.payload, ...(state.actionsList.data || [])],
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  resetError,
  getActionsListSuccess,
  setActionsListParams,
  getActionsSuccess,
  addActionsSuccess,
} = slice.actions;
