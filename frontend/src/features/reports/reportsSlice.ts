import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { getClientReportAPI, getAllReportsAPI, type GetClientReportParams, type GetAllReportsParams } from './reportsAPI';

export interface ReportsState {
    currentReport: Report | null;
    allReports: Report[];
    loadingReport: boolean;
    loadingAll: boolean;
    error: string | null;
}

export interface Report {
    clienteId: string;
    nomeCliente: string;
    pais: string;
    nivelRisco: string;
    statusKyc: string;
    dataCriacao: string;
    totalTransacoes: number;
    totalMovimentado: number;
    mediaTransacao: number;
    dataUltimaTransacao: string | null;
    totalAlertas: number;
    alertasNovos: number;
    alertasEmAnalise: number;
    alertasResolvidos: number;
    alertasCriticos: number;
    periodoInicio: string | null;
    periodoFim: string | null;
}

const initialState: ReportsState = {
    currentReport: null,
    allReports: [],
    loadingReport: true,
    loadingAll: true,
    error: null,
};

export const fetchClientReport = createAsyncThunk(
    'reports/fetchClientReport',
    async (params: GetClientReportParams, { rejectWithValue }) => {
        const report = await getClientReportAPI(params);
        if (!report) {
            return rejectWithValue('Failed to fetch client report');
        }
        return report;
    }
);

export const fetchAllReports = createAsyncThunk(
    'reports/fetchAllReports',
    async (params: GetAllReportsParams, { rejectWithValue }) => {
        const reports = await getAllReportsAPI(params);
        if (!reports) {
            return rejectWithValue('Failed to fetch all reports');
        }
        return reports;
    }
);

export const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {
        clearReport: (state) => {
            state.currentReport = null;
            state.error = null;
        },
        clearAllReports: (state) => {
            state.allReports = [];
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientReport.pending, (state) => {
                state.loadingReport = true;
                state.error = null;
            })
            .addCase(fetchClientReport.fulfilled, (state, action) => {
                state.loadingReport = false;
                state.currentReport = action.payload as unknown as Report;
                state.error = null;
            })
            .addCase(fetchClientReport.rejected, (state, action) => {
                state.loadingReport = false;
                state.error = action.payload as string || 'Failed to fetch report';
            })
            .addCase(fetchAllReports.pending, (state) => {
                state.loadingAll = true;
                state.error = null;
            })
            .addCase(fetchAllReports.fulfilled, (state, action) => {
                state.loadingAll = false;
                state.allReports = action.payload;
                state.error = null;
            })
            .addCase(fetchAllReports.rejected, (state, action) => {
                state.loadingAll = false;
                state.error = action.payload as string || 'Failed to fetch all reports';
            });
    },
});

export const { clearReport, clearAllReports, setError } = reportsSlice.actions;

export const selectCurrentReport = (state: RootState) => {
    return state.reports.currentReport;
};

export const selectAllReports = (state: RootState) => {
    return state.reports.allReports;
};

export const selectReportLoading = (state: RootState) => {
    return state.reports.loadingReport;
};

export const selectAllReportsLoading = (state: RootState) => {
    return state.reports.loadingAll;
};

export const selectReportsError = (state: RootState) => {
    return state.reports.error;
};

export default reportsSlice.reducer;
