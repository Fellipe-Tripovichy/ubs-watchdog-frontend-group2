import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/lib/store';
import { getClientReportAPI, getAllReportsAPI, type GetClientReportParams, type GetAllReportsParams } from './reportsAPI';
import type { ClientReport } from '@/mocks/reportsMock';

// Reports state interface
export interface ReportsState {
    currentReport: ClientReport | null;
    allReports: ClientReport[];
    loading: boolean;
    loadingAll: boolean;
    error: string | null;
}

// Initial state
const initialState: ReportsState = {
    currentReport: null,
    allReports: [],
    loading: false,
    loadingAll: false,
    error: null,
};

// Async thunks
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

// Create slice
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
        // fetchClientReport
        builder
            .addCase(fetchClientReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientReport.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReport = action.payload;
                state.error = null;
            })
            .addCase(fetchClientReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Failed to fetch report';
            })
            // fetchAllReports
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

// Export actions
export const { clearReport, clearAllReports, setError } = reportsSlice.actions;

// Selectors
export const selectCurrentReport = (state: RootState) => {
    return state.reports.currentReport;
};

export const selectAllReports = (state: RootState) => {
    return state.reports.allReports;
};

export const selectReportsLoading = (state: RootState) => {
    return state.reports.loading;
};

export const selectAllReportsLoading = (state: RootState) => {
    return state.reports.loadingAll;
};

export const selectReportsError = (state: RootState) => {
    return state.reports.error;
};

// Export reducer
export default reportsSlice.reducer;
