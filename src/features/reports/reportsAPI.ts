import type { Report } from "./reportsSlice";

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
        if (dataInicio) queryParams.append('dataInicio', dataInicio);
        if (dataFim) queryParams.append('dataFim', dataFim);
        
        const queryString = queryParams.toString();
        const url = `${apiUrl}/api/relatorios/cliente/${clientId}${queryString ? `?${queryString}` : ''}`;
        
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
        const url = `${apiUrl}/api/relatorios/filtrar${queryString ? `?${queryString}` : ''}`;
        
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
