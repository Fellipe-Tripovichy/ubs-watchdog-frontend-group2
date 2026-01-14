import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import {
    getClientsAPI,
    getClientByIdAPI,
    type GetClientsParams,
    type GetClientByIdParams,
    type Client,
} from './clientAPI';

export interface ClientsState {
    clients: Client[];
    currentClient: Client | null;
    loading: boolean;
    loadingAll: boolean;
    loadingCurrent: boolean;
    error: string | null;
}

const initialState: ClientsState = {
    clients: [],
    currentClient: null,
    loading: true,
    loadingAll: true,
    loadingCurrent: true,
    error: null,
};


export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (params: GetClientsParams, { rejectWithValue }) => {
        const clients = await getClientsAPI(params);
        if (!clients) {
            return rejectWithValue('Failed to fetch clients');
        }
        return clients;
    }
);

export const fetchClientById = createAsyncThunk(
    'clients/fetchClientById',
    async (params: GetClientByIdParams, { rejectWithValue }) => {
        const client = await getClientByIdAPI(params);
        if (!client) {
            return rejectWithValue('Failed to fetch client');
        }
        return client;
    }
);

export const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        clearClient: (state) => {
            state.currentClient = null;
            state.error = null;
        },
        clearClients: (state) => {
            state.clients = [];
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loadingAll = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loadingAll = false;
                state.clients = action.payload;
                state.error = null;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loadingAll = false;
                state.error = action.payload as string || 'Failed to fetch clients';
            })
            .addCase(fetchClientById.pending, (state) => {
                state.loadingCurrent = true;
                state.error = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.loadingCurrent = false;
                state.currentClient = action.payload;
                state.error = null;
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.loadingCurrent = false;
                state.error = action.payload as string || 'Failed to fetch client';
            });
    },
});

export const { clearClient, clearClients, setError } = clientsSlice.actions;

export const selectClients = (state: RootState) => {
    return state.clients.clients;
};

export const selectCurrentClient = (state: RootState) => {
    return state.clients.currentClient;
};

export const selectClientsLoading = (state: RootState) => {
    return state.clients.loading;
};

export const selectAllClientsLoading = (state: RootState) => {
    return state.clients.loadingAll;
};

export const selectCurrentClientLoading = (state: RootState) => {
    return state.clients.loadingCurrent;
};

export const selectClientsError = (state: RootState) => {
    return state.clients.error;
};

export default clientsSlice.reducer;
