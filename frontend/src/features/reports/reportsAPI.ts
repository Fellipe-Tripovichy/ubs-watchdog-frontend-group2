import type { Report } from "./reportsSlice";
import { isoToDate, dateToISO } from "@/lib/utils";

export interface GetClientReportParams {
    clientId: string;
    token: string;
    dataInicio?: string;
    dataFim?: string;
}

export interface GetAllReportsParams {
    token: string;
    statusAlerta?: string;
    statusKyc?: string;
    pais?: string;
}

export const getClientReportAPI = async (params: GetClientReportParams): Promise<Report | null> => {
    const { clientId, token, dataInicio, dataFim } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const queryParams = new URLSearchParams();
        
        // Adjust dataInicio: subtract one day
        if (dataInicio) {
            // Parse the full ISO string
            const inicioDate = new Date(dataInicio);
            if (!isNaN(inicioDate.getTime())) {
                inicioDate.setDate(inicioDate.getDate() - 1);
                // Convert to ISO string and preserve timezone format
                const isoString = inicioDate.toISOString();
                // Extract timezone from original or default to -03:00
                const timezoneMatch = dataInicio.match(/[+-]\d{2}:\d{2}$/);
                const timezone = timezoneMatch ? timezoneMatch[0] : '-03:00';
                // Replace Z with timezone
                queryParams.append('dataInicio', isoString.replace('Z', timezone));
            } else {
                // Fallback: extract date part if full ISO parsing fails
                const datePart = dataInicio.split('T')[0];
                const fallbackDate = isoToDate(datePart);
                fallbackDate.setDate(fallbackDate.getDate() - 1);
                queryParams.append('dataInicio', dateToISO(fallbackDate));
            }
        }
        
        // Adjust dataFim: add one day
        if (dataFim) {
            // Parse the full ISO string
            const fimDate = new Date(dataFim);
            if (!isNaN(fimDate.getTime())) {
                fimDate.setDate(fimDate.getDate() + 1);
                // Convert to ISO string and preserve timezone format
                const isoString = fimDate.toISOString();
                // Extract timezone from original or default to -03:00
                const timezoneMatch = dataFim.match(/[+-]\d{2}:\d{2}$/);
                const timezone = timezoneMatch ? timezoneMatch[0] : '-03:00';
                // Replace Z with timezone
                queryParams.append('dataFim', isoString.replace('Z', timezone));
            } else {
                // Fallback: extract date part if full ISO parsing fails
                const datePart = dataFim.split('T')[0];
                const fallbackDate = isoToDate(datePart);
                fallbackDate.setDate(fallbackDate.getDate() + 1);
                queryParams.append('dataFim', dateToISO(fallbackDate));
            }
        }
        
        const queryString = queryParams.toString();
        const url = `/api/relatorios/cliente/${clientId}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data as Report;
    } catch {
        return null;
    }
}

export const getAllReportsAPI = async (params: GetAllReportsParams): Promise<Report[] | null> => {
    const { token, statusAlerta, statusKyc, pais } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const queryParams = new URLSearchParams();
        if (statusAlerta) queryParams.append('statusAlerta', statusAlerta);
        if (statusKyc) queryParams.append('statusKyc', statusKyc);
        if (pais) queryParams.append('pais', pais);
        
        const queryString = queryParams.toString();
        const url = `/api/relatorios/filtrar${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data as Report[];
    } catch (error) {
        return null;
    }
}
