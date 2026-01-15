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
    contraparteClient: Client | null;
    loading: boolean;
    loadingAll: boolean;
    loadingCurrent: boolean;
    loadingContraparte: boolean;
    error: string | null;
}

const initialState: ClientsState = {
    clients: [],
    currentClient: null,
    contraparteClient: null,
    loading: true,
    loadingAll: true,
    loadingCurrent: false,
    loadingContraparte: false,
    error: null,
};


export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (params: GetClientsParams, { rejectWithValue }) => {
        const clients = await getClientsAPI(params);
        if (!clients) {
            return rejectWithValue('Erro ao buscar clientes');
        }
        return clients;
    }
);

export const fetchClientById = createAsyncThunk(
    'clients/fetchClientById',
    async ({ clientId, token, contraparte }: GetClientByIdParams, { rejectWithValue }) => {
        const client = await getClientByIdAPI({ clientId, token, contraparte });
        if (!client) {
            return rejectWithValue('Erro ao buscar ' + (contraparte ? 'contraparte' : 'cliente'));
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
            state.contraparteClient = null;
            state.error = null;
        },
        clearClients: (state) => {
            state.clients = [];
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setClientLoading: (state, action: PayloadAction<boolean>) => {
            state.loadingCurrent = action.payload;
        },
        setContraparteClientLoading: (state, action: PayloadAction<boolean>) => {
            state.loadingContraparte = action.payload;
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
                state.error = action.payload as string || 'Erro ao buscar clientes';
            })
            .addCase(fetchClientById.pending, (state) => {
                state.loadingCurrent = true;
                state.error = null;
            })
            .addCase(fetchClientById.fulfilled, (state, action) => {
                state.loadingCurrent = false;
                if (action.meta.arg.contraparte) {
                    state.contraparteClient = action.payload;
                } else {
                    state.currentClient = action.payload;
                }
                state.error = null;
            })
            .addCase(fetchClientById.rejected, (state, action) => {
                state.loadingCurrent = false;
                state.error = action.payload as string || 'Erro ao buscar ' + (action.meta.arg.contraparte ? 'contraparte' : 'cliente');
            });
    },
});

export const { clearClient, clearClients, setError, setClientLoading, setContraparteClientLoading } = clientsSlice.actions;

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

export const selectContraparteClient = (state: RootState) => {
    return state.clients.contraparteClient;
};

export const selectContraparteClientLoading = (state: RootState) => {
    return state.clients.loadingContraparte;
};

export default clientsSlice.reducer;
