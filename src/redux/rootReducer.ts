import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/user';
import messagesReducer from './slices/messages';
import actionsReducer from './slices/actions';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  user: userReducer,
  messages: messagesReducer,
  actions: actionsReducer
});

export { rootPersistConfig, rootReducer };
