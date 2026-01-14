export type Severidade = 'Baixa' | 'Media' | 'Alta' | 'Critica';
export type Status = 'Novo' | 'EmAnalise' | 'Resolvido';

export interface Alert {
    id: string;
    clienteId: string;
    transacaoId: string;
    nomeRegra: string;
    descricao: string;
    severidade: Severidade;
    status: Status;
    dataCriacao: string; 
    dataResolucao: string | null;
    resolvidoPor: string | null;
    resolucao: string | null;
}

export interface GetAlertsParams {
    token: string;
    clienteId?: string;
    severidade?: Severidade;
    status?: Status;
    dataCriacaoInicio?: string; 
    dataCriacaoFim?: string; 
    dataResolucao?: string; 
}

export interface GetAlertByIdParams {
    alertId: string;
    token: string;
}

export interface GetClientAlertsParams {
    clientId: string;
    token: string;
}

export interface GetAlertsByStatusParams {
    status: Status;
    token: string;
}

export interface StartAnalysisParams {
    alertId: string;
    token: string;
}

export interface ResolveAlertParams {
    alertId: string;
    resolvidoPor: string;
    resolucao: string;
    token: string;
}

export interface ComplianceState {
    alerts: Alert[];
    currentAlert: Alert | null;
    clientAlerts: Alert[];
    statusAlerts: Alert[];
    loading: boolean;
    loadingAll: boolean;
    loadingClient: boolean;
    loadingStatus: boolean;
    loadingCurrent: boolean;
    updating: boolean;
    error: string | null;
}
