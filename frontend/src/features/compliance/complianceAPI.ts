import type {
    Alert,
    GetAlertsParams,
    GetAlertByIdParams,
    GetClientAlertsParams,
    GetAlertsByStatusParams,
    StartAnalysisParams,
    ResolveAlertParams,
} from '@/types/compliance';
import { isoToDate, dateToISO } from "@/lib/utils";

export type {
    Alert,
    GetAlertsParams,
    GetAlertByIdParams,
    GetClientAlertsParams,
    GetAlertsByStatusParams,
    StartAnalysisParams,
    ResolveAlertParams,
} from '@/types/compliance';

export const getAlertsAPI = async (params: GetAlertsParams): Promise<Alert[] | null> => {
    const { token, clienteId, severidade, status, dataCriacaoInicio, dataCriacaoFim, dataResolucao } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    console.log("dataCriacaoFim", dataCriacaoFim);
    console.log("dataResolucao", dataResolucao);
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const queryParams = new URLSearchParams();
        if (clienteId) queryParams.append('clienteId', clienteId);
        if (dataCriacaoInicio) queryParams.append('dataCriacaoInicio', dataCriacaoInicio);
        
        // Adjust dataCriacaoFim: add one day
        if (dataCriacaoFim) {
            queryParams.append('dataCriacaoFim', dataCriacaoFim);
        }
        
        // Adjust dataResolucao: add one day
        if (dataResolucao) {
            queryParams.append('dataResolucao', dataResolucao);
        }
        
        if (severidade) queryParams.append('severidade', severidade);
        if (status) queryParams.append('status', status);
        
        const queryString = queryParams.toString();
        const url = `/api/alertas/filtrar${queryString ? `?${queryString}` : ''}`;
        
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
        return data as Alert[];
    } catch {
        return null;
    }
};

export const getAlertByIdAPI = async (params: GetAlertByIdParams): Promise<Alert | null> => {
    const { alertId, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`/api/alertas/${alertId}`, {
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
        return data as Alert;
    } catch (error) {
        return null;
    }
};

export const getClientAlertsAPI = async (params: GetClientAlertsParams): Promise<Alert[] | null> => {
    const { clientId, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`/api/alertas/clientes/${clientId}`, {
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
        return data as Alert[];
    } catch {
        return null;
    }
};

export const getAlertsByStatusAPI = async (params: GetAlertsByStatusParams): Promise<Alert[] | null> => {
    const { status, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`/api/alertas/status/${status}`, {
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
        return data as Alert[];
    } catch {
        return null;
    }
};

export const startAnalysisAPI = async (params: StartAnalysisParams): Promise<Alert | null> => {
    const { alertId, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`/api/alertas/${alertId}/iniciar-analise`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data as Alert;
    } catch (error) {
        return null;
    }
};

export const resolveAlertAPI = async (params: ResolveAlertParams): Promise<Alert | null> => {
    const { alertId, resolvidoPor, resolucao, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`/api/alertas/${alertId}/resolver`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resolvidoPor: resolvidoPor,
                resolucao: resolucao,
            }),
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data as Alert;
    } catch (error) {
        return null;
    }
};
