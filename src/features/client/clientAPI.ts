export interface Client {
    id: string;
    nome: string;
    pais: string;
    nivelRisco: string;
    statusKyc: string;
    dataCriacao: string;
}

export interface GetClientsParams {
    token: string;
}

export interface GetClientByIdParams {
    clientId: string;
    token: string;
}

export const getClientsAPI = async (params: GetClientsParams): Promise<Client[] | null> => {
    const { token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/clientes`, {
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
        return data as Client[];
    } catch {
        return null;
    }
};

export const getClientByIdAPI = async (params: GetClientByIdParams): Promise<Client | null> => {
    const { clientId, token } = params;
    const apiUrl = process.env.NEXT_PUBLIC_UBS_WATCHDOG_API;
    
    if (!apiUrl) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/clientes/${clientId}`, {
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
        return data as Client;
    } catch (error) {
        return null;
    }
};
