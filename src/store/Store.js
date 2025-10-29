import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import { appSlice } from './app/reducer';
import { setVersionStatus, authSlice } from './user/reducer';
import { retailerSlice } from './retailer/reducer';
import { vendorSlice } from './vendor/reducer';
// import {appSlice} from './app/reducer';

const persistConfig = {
  key: 'persistedReducer',
  storage: AsyncStorage,
  blacklist: [''],
  whitelist: ['user'] // blacklist and whitelist (all lowercase).
};

const combine = combineReducers({
  app: appSlice.reducer,
  user: authSlice.reducer,
  retailer: retailerSlice.reducer,
  vendor: vendorSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, combine);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
});

let persistor = persistStore(store);

persistor?.subscribe(() => {
  const currentState = store?.getState();

  if (currentState?.user) {
    store?.dispatch(setVersionStatus(null));
  }
});

export { persistor };
