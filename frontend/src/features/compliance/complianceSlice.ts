import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import {
    getAlertsAPI,
    getAlertByIdAPI,
    getClientAlertsAPI,
    getAlertsByStatusAPI,
    startAnalysisAPI,
    resolveAlertAPI,
} from './complianceAPI';
import type {
    GetAlertsParams,
    GetAlertByIdParams,
    GetClientAlertsParams,
    GetAlertsByStatusParams,
    StartAnalysisParams,
    ResolveAlertParams,
    Alert,
    ComplianceState,
} from '@/types/compliance';

const initialState: ComplianceState = {
    alerts: [],
    currentAlert: null,
    clientAlerts: [],
    statusAlerts: [],
    loading: true,
    loadingAll: true,
    loadingClient: true,
    loadingStatus: true,
    loadingCurrent: true,
    updating: false,
    error: null,
};

export const fetchAlerts = createAsyncThunk(
    'compliance/fetchAlerts',
    async (params: GetAlertsParams, { rejectWithValue }) => {
        const alerts = await getAlertsAPI(params);
        if (!alerts) {
            return rejectWithValue('Failed to fetch alerts');
        }
        return alerts;
    }
);

export const fetchAlertById = createAsyncThunk(
    'compliance/fetchAlertById',
    async (params: GetAlertByIdParams, { rejectWithValue }) => {
        const alert = await getAlertByIdAPI(params);
        if (!alert) {
            return rejectWithValue('Failed to fetch alert');
        }
        return alert;
    }
);

export const fetchClientAlerts = createAsyncThunk(
    'compliance/fetchClientAlerts',
    async (params: GetClientAlertsParams, { rejectWithValue }) => {
        const alerts = await getClientAlertsAPI(params);
        if (!alerts) {
            return rejectWithValue('Failed to fetch client alerts');
        }
        return alerts;
    }
);

export const fetchAlertsByStatus = createAsyncThunk(
    'compliance/fetchAlertsByStatus',
    async (params: GetAlertsByStatusParams, { rejectWithValue }) => {
        const alerts = await getAlertsByStatusAPI(params);
        if (!alerts) {
            return rejectWithValue('Failed to fetch alerts by status');
        }
        return alerts;
    }
);

export const startAnalysis = createAsyncThunk(
    'compliance/startAnalysis',
    async (params: StartAnalysisParams, { rejectWithValue }) => {
        const alert = await startAnalysisAPI(params);
        if (!alert) {
            return rejectWithValue('Failed to start analysis');
        }
        return alert;
    }
);

export const resolveAlert = createAsyncThunk(
    'compliance/resolveAlert',
    async (params: ResolveAlertParams, { rejectWithValue }) => {
        const alert = await resolveAlertAPI(params);
        if (!alert) {
            return rejectWithValue('Failed to resolve alert');
        }
        return alert;
    }
);

export const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {
        clearAlert: (state) => {
            state.currentAlert = null;
            state.error = null;
        },
        clearAlerts: (state) => {
            state.alerts = [];
            state.error = null;
        },
        clearClientAlerts: (state) => {
            state.clientAlerts = [];
            state.error = null;
        },
        clearStatusAlerts: (state) => {
            state.statusAlerts = [];
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlerts.pending, (state) => {
                state.loadingAll = true;
                state.error = null;
            })
            .addCase(fetchAlerts.fulfilled, (state, action) => {
                state.loadingAll = false;
                state.alerts = action.payload;
                state.error = null;
            })
            .addCase(fetchAlerts.rejected, (state, action) => {
                state.loadingAll = false;
                state.error = action.payload as string || 'Failed to fetch alerts';
            })
            .addCase(fetchAlertById.pending, (state) => {
                state.loadingCurrent = true;
                state.error = null;
            })
            .addCase(fetchAlertById.fulfilled, (state, action) => {
                state.loadingCurrent = false;
                state.currentAlert = action.payload;
                state.error = null;
            })
            .addCase(fetchAlertById.rejected, (state, action) => {
                state.loadingCurrent = false;
                state.error = action.payload as string || 'Failed to fetch alert';
            })
            .addCase(fetchClientAlerts.pending, (state) => {
                state.loadingClient = true;
                state.error = null;
            })
            .addCase(fetchClientAlerts.fulfilled, (state, action) => {
                state.loadingClient = false;
                state.clientAlerts = action.payload;
                state.error = null;
            })
            .addCase(fetchClientAlerts.rejected, (state, action) => {
                state.loadingClient = false;
                state.error = action.payload as string || 'Failed to fetch client alerts';
            })
            .addCase(fetchAlertsByStatus.pending, (state) => {
                state.loadingStatus = true;
                state.error = null;
            })
            .addCase(fetchAlertsByStatus.fulfilled, (state, action) => {
                state.loadingStatus = false;
                state.statusAlerts = action.payload;
                state.error = null;
            })
            .addCase(fetchAlertsByStatus.rejected, (state, action) => {
                state.loadingStatus = false;
                state.error = action.payload as string || 'Failed to fetch alerts by status';
            })
            .addCase(startAnalysis.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(startAnalysis.fulfilled, (state, action) => {
                state.updating = false;

                const updatedAlert = action.payload;
                const updateInArray = (alerts: Alert[]) => {
                    const index = alerts.findIndex(a => a.id === updatedAlert.id);
                    if (index !== -1) {
                        alerts[index] = updatedAlert;
                    }
                };
                updateInArray(state.alerts);
                updateInArray(state.clientAlerts);
                updateInArray(state.statusAlerts);
                if (state.currentAlert?.id === updatedAlert.id) {
                    state.currentAlert = updatedAlert;
                }
                state.error = null;
            })
            .addCase(startAnalysis.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string || 'Failed to start analysis';
            })
            .addCase(resolveAlert.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(resolveAlert.fulfilled, (state, action) => {
                state.updating = false;

                const updatedAlert = action.payload;
                const updateInArray = (alerts: Alert[]) => {
                    const index = alerts.findIndex(a => a.id === updatedAlert.id);
                    if (index !== -1) {
                        alerts[index] = updatedAlert;
                    }
                };
                updateInArray(state.alerts);
                updateInArray(state.clientAlerts);
                updateInArray(state.statusAlerts);
                if (state.currentAlert?.id === updatedAlert.id) {
                    state.currentAlert = updatedAlert;
                }
                state.error = null;
            })
            .addCase(resolveAlert.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string || 'Failed to resolve alert';
            });
    },
});

export const { clearAlert, clearAlerts, clearClientAlerts, clearStatusAlerts, setError } = complianceSlice.actions;

export const selectAlerts = (state: RootState) => {
    return state.compliance.alerts;
};

export const selectCurrentAlert = (state: RootState) => {
    return state.compliance.currentAlert;
};

export const selectClientAlerts = (state: RootState) => {
    return state.compliance.clientAlerts;
};

export const selectStatusAlerts = (state: RootState) => {
    return state.compliance.statusAlerts;
};

export const selectComplianceLoading = (state: RootState) => {
    return state.compliance.loading;
};

export const selectAllAlertsLoading = (state: RootState) => {
    return state.compliance.loadingAll;
};

export const selectClientAlertsLoading = (state: RootState) => {
    return state.compliance.loadingClient;
};

export const selectStatusAlertsLoading = (state: RootState) => {
    return state.compliance.loadingStatus;
};

export const selectCurrentAlertLoading = (state: RootState) => {
    return state.compliance.loadingCurrent;
};

export const selectComplianceUpdating = (state: RootState) => {
    return state.compliance.updating;
};

export const selectComplianceError = (state: RootState) => {
    return state.compliance.error;
};

export default complianceSlice.reducer;
