import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import reportsReducer from '@/features/reports/reportsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      reports: reportsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [],
          ignoredActionPaths: [],
          ignoredPaths: [],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>;
export type AppDispatch = AppStore['dispatch'];

