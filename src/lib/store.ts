import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';

// This is the root reducer - you can add your slices here

export const makeStore = () => {
  return configureStore({
    reducer: {
      // Add your reducers here
      auth: authReducer,
      // transactions: transactionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [],
          // Ignore these field paths in all actions
          ignoredActionPaths: [],
          // Ignore these paths in the state
          ignoredPaths: [],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = AppStore['dispatch'];

