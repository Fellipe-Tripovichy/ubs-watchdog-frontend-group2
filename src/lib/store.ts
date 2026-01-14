import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import reportsReducer from '@/features/reports/reportsSlice';
import transactionsReducer from '@/features/transactions/transactionsSlice';
import complianceReducer from '@/features/compliance/complianceSlice';
import clientsReducer from '@/features/client/clientSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      reports: reportsReducer,
      transactions: transactionsReducer,
      compliance: complianceReducer,
      clients: clientsReducer,
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

