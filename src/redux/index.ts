import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';

import reducer from './slices';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['account', 'common'], // Add reducer names you want to persist here
};

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, reducer);

// mount it on the Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Create a persistor
const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store, persistor}; // Export persistor
