import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import {
    createTransactionAPI,
    getTransactionsAPI,
    getTransactionByIdAPI,
    getClientTransactionsAPI,
    type CreateTransactionParams,
    type GetTransactionsParams,
    type GetTransactionByIdParams,
    type GetClientTransactionsParams,
    type Transaction,
} from './transactionsAPI';

export interface TransactionsState {
    transactions: Transaction[];
    currentTransaction: Transaction | null;
    clientTransactions: Transaction[];
    loading: boolean;
    loadingAll: boolean;
    loadingClient: boolean;
    loadingCurrent: boolean;
    creating: boolean;
    error: string | null;
}

const initialState: TransactionsState = {
    transactions: [],
    currentTransaction: null,
    clientTransactions: [],
    loading: true,
    loadingAll: true,
    loadingClient: true,
    loadingCurrent: true,
    creating: false,
    error: null,
};


export const createTransaction = createAsyncThunk(
    'transactions/createTransaction',
    async (params: CreateTransactionParams, { rejectWithValue }) => {
        const transaction = await createTransactionAPI(params);
        if (!transaction) {
            return rejectWithValue('Failed to create transaction');
        }
        return transaction;
    }
);

export const fetchTransactions = createAsyncThunk(
    'transactions/fetchTransactions',
    async (params: GetTransactionsParams, { rejectWithValue }) => {
        const transactions = await getTransactionsAPI(params);
        if (!transactions) {
            return rejectWithValue('Failed to fetch transactions');
        }
        return transactions;
    }
);

export const fetchTransactionById = createAsyncThunk(
    'transactions/fetchTransactionById',
    async (params: GetTransactionByIdParams, { rejectWithValue }) => {
        const transaction = await getTransactionByIdAPI(params);
        if (!transaction) {
            return rejectWithValue('Failed to fetch transaction');
        }
        return transaction;
    }
);

export const fetchClientTransactions = createAsyncThunk(
    'transactions/fetchClientTransactions',
    async (params: GetClientTransactionsParams, { rejectWithValue }) => {
        const transactions = await getClientTransactionsAPI(params);
        if (!transactions) {
            return rejectWithValue('Failed to fetch client transactions');
        }
        return transactions;
    }
);

export const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearTransaction: (state) => {
            state.currentTransaction = null;
            state.error = null;
        },
        clearTransactions: (state) => {
            state.transactions = [];
            state.error = null;
        },
        clearClientTransactions: (state) => {
            state.clientTransactions = [];
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTransaction.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.creating = false;
                state.transactions.unshift(action.payload);
                state.error = null;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload as string || 'Failed to create transaction';
            })
            .addCase(fetchTransactions.pending, (state) => {
                state.loadingAll = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loadingAll = false;
                state.transactions = action.payload;
                state.error = null;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loadingAll = false;
                state.error = action.payload as string || 'Failed to fetch transactions';
            })
            .addCase(fetchTransactionById.pending, (state) => {
                state.loadingCurrent = true;
                state.error = null;
            })
            .addCase(fetchTransactionById.fulfilled, (state, action) => {
                state.loadingCurrent = false;
                state.currentTransaction = action.payload;
                state.error = null;
            })
            .addCase(fetchTransactionById.rejected, (state, action) => {
                state.loadingCurrent = false;
                state.error = action.payload as string || 'Failed to fetch transaction';
            })
            .addCase(fetchClientTransactions.pending, (state) => {
                state.loadingClient = true;
                state.error = null;
            })
            .addCase(fetchClientTransactions.fulfilled, (state, action) => {
                state.loadingClient = false;
                state.clientTransactions = action.payload;
                state.error = null;
            })
            .addCase(fetchClientTransactions.rejected, (state, action) => {
                state.loadingClient = false;
                state.error = action.payload as string || 'Failed to fetch client transactions';
            });
    },
});

export const { clearTransaction, clearTransactions, clearClientTransactions, setError } = transactionsSlice.actions;

export const selectTransactions = (state: RootState) => {
    return state.transactions.transactions;
};

export const selectCurrentTransaction = (state: RootState) => {
    return state.transactions.currentTransaction;
};

export const selectClientTransactions = (state: RootState) => {
    return state.transactions.clientTransactions;
};

export const selectTransactionsLoading = (state: RootState) => {
    return state.transactions.loading;
};

export const selectAllTransactionsLoading = (state: RootState) => {
    return state.transactions.loadingAll;
};

export const selectClientTransactionsLoading = (state: RootState) => {
    return state.transactions.loadingClient;
};

export const selectCurrentTransactionLoading = (state: RootState) => {
    return state.transactions.loadingCurrent;
};

export const selectTransactionCreating = (state: RootState) => {
    return state.transactions.creating;
};

export const selectTransactionsError = (state: RootState) => {
    return state.transactions.error;
};

export default transactionsSlice.reducer;
