import { getMockClientReport, getMockAllReports, type ClientReport } from "@/mocks/reportsMock";

export interface GetClientReportParams {
    clientId: string;
    token: string;
    startDate?: string; // ISO date string (YYYY-MM-DD)
    endDate?: string; // ISO date string (YYYY-MM-DD)
}

export interface GetAllReportsParams {
    token: string;
    startDate?: string; // ISO date string (YYYY-MM-DD)
    endDate?: string; // ISO date string (YYYY-MM-DD)
}

export const getClientReportAPI = async (params: GetClientReportParams): Promise<ClientReport | null> => {
    const { clientId, startDate, endDate } = params;
    // token will be used when implementing the actual API call
    
    // For now, use mock data
    // In the future, this will make a REST request to NEXT_PUBLIC_API
    // const apiUrl = process.env.NEXT_PUBLIC_API;
    // if (!apiUrl) {
    //     return null;
    // }
    
    // TODO: Replace with actual API call when backend is ready
    // const { token } = params;
    // try {
    //     const queryParams = new URLSearchParams();
    //     if (startDate) queryParams.append('startDate', startDate);
    //     if (endDate) queryParams.append('endDate', endDate);
    //     
    //     const response = await fetch(`${apiUrl}/reports/${clientId}?${queryParams.toString()}`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     
    //     if (!response.ok) {
    //         return null;
    //     }
    //     
    //     const data = await response.json();
    //     return data as ClientReport;
    // } catch (error) {
    //     return null;
    // }
    
    // Using mock data for now - pass date filters to the mock function
    return getMockClientReport(clientId, startDate, endDate);
}

export const getAllReportsAPI = async (params: GetAllReportsParams): Promise<ClientReport[] | null> => {
    const { token, startDate, endDate } = params;
    // token will be used when implementing the actual API call
    
    // For now, use mock data
    // In the future, this will make a REST request to NEXT_PUBLIC_API
    // const apiUrl = process.env.NEXT_PUBLIC_API;
    // if (!apiUrl) {
    //     return null;
    // }
    
    // TODO: Replace with actual API call when backend is ready
    // try {
    //     const queryParams = new URLSearchParams();
    //     if (startDate) queryParams.append('startDate', startDate);
    //     if (endDate) queryParams.append('endDate', endDate);
    //     
    //     const response = await fetch(`${apiUrl}/reports?${queryParams.toString()}`, {
    //         method: 'GET',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     
    //     if (!response.ok) {
    //         return null;
    //     }
    //     
    //     const data = await response.json();
    //     return data as ClientReport[];
    // } catch (error) {
    //     return null;
    // }
    
    // Using mock data for now - pass date filters to the mock function
    return getMockAllReports(startDate, endDate);
}
