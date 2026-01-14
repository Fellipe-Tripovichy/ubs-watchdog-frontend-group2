export interface Contraparte {
    nome: string;
    pais: string;
}

export interface CreateTransactionRequest {
    clienteId: string;
    tipo: string;
    valor: number;
    moeda: string;
    contraparte?: Contraparte;
}

export interface Transaction {
    id: string;
    clienteId: string;
    tipo: string;
    valor: number;
    moeda: string;
    contraparte: string | null;
    dataHora: string;
    quantidadeAlertas: number;
}

export interface CreateTransactionParams {
    transaction: CreateTransactionRequest;
    token: string;
}

export interface GetTransactionsParams {
    token: string;
    clienteId?: string;
    tipo?: "Deposito" | "Saque" | "Transferencia";
    moeda?: string;
    dataInicio?: string;
    dataFim?: string;
}

export interface GetTransactionByIdParams {
    transacaoId: string;
    token: string;
}

export interface GetClientTransactionsParams {
    clientId: string;
    token: string;
    dataInicio?: string;
    dataFim?: string;
}

export const createTransactionAPI = async (params: CreateTransactionParams): Promise<Transaction | null> => {
    const { transaction, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/transacoes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data as Transaction;
    } catch {
        return null;
    }
};

export const getTransactionsAPI = async (params: GetTransactionsParams): Promise<Transaction[] | null> => {
    const { token, clienteId, tipo, moeda, dataInicio, dataFim } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const queryParams = new URLSearchParams();
        if (clienteId) queryParams.append('clienteId', clienteId);
        if (tipo) queryParams.append('tipo', tipo);
        if (moeda) queryParams.append('moeda', moeda);
        if (dataInicio) queryParams.append('dataInicio', dataInicio);
        if (dataFim) queryParams.append('dataFim', dataFim);
        
        const queryString = queryParams.toString();
        const url = `${apiUrl}/api/transacoes/filtrar${queryString ? `?${queryString}` : ''}`;
        
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
        return data as Transaction[];
    } catch (error) {
        return null;
    }
};

export const getTransactionByIdAPI = async (params: GetTransactionByIdParams): Promise<Transaction | null> => {
    const { transacaoId, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/transacoes/${transacaoId}`, {
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
        return data as Transaction;
    } catch {
        return null;
    }
};

export const getClientTransactionsAPI = async (params: GetClientTransactionsParams): Promise<Transaction[] | null> => {
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
        const url = `${apiUrl}/api/transacoes/clientes/${clientId}${queryString ? `?${queryString}` : ''}`;
        
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
        return data as Transaction[];
    } catch (error) {
        return null;
    }
};
