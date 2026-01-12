export type Client = {
  id: string;
  name: string;
  country: string;
  riskLevel: "Baixo" | "Médio" | "Alto";
  kycStatus: "Aprovado" | "Pendente" | "Reprovado";
};

export type TransactionType = "Depósito" | "Saque" | "Transferência";

export type Transaction = {
  id: string;
  clientId: string;
  type: TransactionType;
  amount: number;
  currency: "BRL" | "USD" | "EUR";
  counterparty: string;
  dateTime: string;
};

export type AlertSeverity = "Baixa" | "Média" | "Alta" | "Crítica";
export type AlertStatus = "Novo" | "Em Análise" | "Resolvido";

export type Alert = {
  id: string;
  clientId: string;
  transactionId: string;
  rule: string;
  severity: AlertSeverity;
  status: AlertStatus;
  dataCriacao: string;
  dataResolucao: string | null;
};

export type ClientReport = {
  client: Client;
  transactions: Transaction[];
  alerts: Alert[];
};

const clients: Client[] = [
  {
    id: "C-1023",
    name: "Maria Eduarda Ribeiro Facio",
    country: "Brasil",
    riskLevel: "Médio",
    kycStatus: "Aprovado",
  },
  {
    id: "C-2041",
    name: "João Henrique Souza",
    country: "Suíça",
    riskLevel: "Alto",
    kycStatus: "Pendente",
  },
];

const reports: ClientReport[] = [
  {
    client: clients[0],
    transactions: [
      {
        id: "T-9001",
        clientId: "C-1023",
        type: "Depósito",
        amount: 15000,
        currency: "BRL",
        counterparty: "Cash",
        dateTime: "2026-01-02T10:15:00-03:00",
      },
      {
        id: "T-9002",
        clientId: "C-1023",
        type: "Transferência",
        amount: 8200,
        currency: "BRL",
        counterparty: "ACME LTDA",
        dateTime: "2026-01-04T16:05:00-03:00",
      },
      {
        id: "T-9003",
        clientId: "C-1023",
        type: "Saque",
        amount: 6000,
        currency: "BRL",
        counterparty: "ATM",
        dateTime: "2026-01-06T18:40:00-03:00",
      },
      {
        id: "T-9004",
        clientId: "C-1023",
        type: "Transferência",
        amount: 12000,
        currency: "BRL",
        counterparty: "Múltiplos destinatários",
        dateTime: "2026-01-08T09:20:00-03:00",
      },
      {
        id: "T-9005",
        clientId: "C-1023",
        type: "Transferência",
        amount: 2500,
        currency: "USD",
        counterparty: "Vendor US Inc.",
        dateTime: "2026-01-09T13:10:00-03:00",
      },
      {
        id: "T-9006",
        clientId: "C-1023",
        type: "Depósito",
        amount: 1800,
        currency: "EUR",
        counterparty: "Exchange Desk",
        dateTime: "2026-01-10T11:45:00-03:00",
      },
    ],
    alerts: [
      {
        id: "A-3001",
        clientId: "C-1023",
        transactionId: "T-9001",
        rule: "Depósito em espécie acima do limite",
        severity: "Alta",
        status: "Em Análise",
        dataCriacao: "2026-01-02T10:20:00-03:00",
        dataResolucao: null,
      },
      {
        id: "A-3002",
        clientId: "C-1023",
        transactionId: "T-9004",
        rule: "Múltiplas transferências em curto período",
        severity: "Média",
        status: "Novo",
        dataCriacao: "2026-01-08T09:25:00-03:00",
        dataResolucao: null,
      },
      {
        id: "A-3003",
        clientId: "C-1023",
        transactionId: "T-9002",
        rule: "Contraparte incomum",
        severity: "Baixa",
        status: "Resolvido",
        dataCriacao: "2026-01-04T16:10:00-03:00",
        dataResolucao: "2026-01-07T12:00:00-03:00",
      },
    ],
  },

  {
    client: clients[1],
    transactions: [
      {
        id: "T-9101",
        clientId: "C-2041",
        type: "Depósito",
        amount: 50000,
        currency: "USD",
        counterparty: "Wire Incoming",
        dateTime: "2026-01-03T09:00:00Z",
      },
      {
        id: "T-9102",
        clientId: "C-2041",
        type: "Transferência",
        amount: 42000,
        currency: "USD",
        counterparty: "Offshore Co.",
        dateTime: "2026-01-05T12:30:00Z",
      },
      {
        id: "T-9103",
        clientId: "C-2041",
        type: "Saque",
        amount: 12000,
        currency: "USD",
        counterparty: "Branch Zurich",
        dateTime: "2026-01-09T15:45:00Z",
      },
    ],
    alerts: [
      {
        id: "A-3101",
        clientId: "C-2041",
        transactionId: "T-9102",
        rule: "Transferência internacional suspeita",
        severity: "Alta",
        status: "Novo",
        dataCriacao: "2026-01-05T12:40:00Z",
        dataResolucao: null,
      },
      {
        id: "A-3102",
        clientId: "C-2041",
        transactionId: "T-9101",
        rule: "Volume elevado em curto período",
        severity: "Média",
        status: "Resolvido",
        dataCriacao: "2026-01-03T09:10:00Z",
        dataResolucao: "2026-01-08T10:00:00Z",
      },
      
      {
        id: "A-3103",
        clientId: "C-2041",
        transactionId: "T-9005",
        rule: "Padrão de lavagem detectado",
        severity: "Crítica",
        status: "Em Análise",
        dataCriacao: "2026-01-10T12:10:00-03:00",
        dataResolucao: null,
      },
    ],
  },
];

export function getMockClientReport(
  clientId: string,
  startDate?: string,
  endDate?: string
): ClientReport {
  const baseReport = reports.find(report => report.client.id === clientId) ?? reports[0];

  if (!startDate || !endDate) {
    return baseReport;
  }

  const periodStart = new Date(`${startDate}T00:00:00`);
  const periodEnd = new Date(`${endDate}T23:59:59`);

  const filteredTransactions = baseReport.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.dateTime);
    return transactionDate >= periodStart && transactionDate <= periodEnd;
  });

  const filteredAlerts = baseReport.alerts.filter((alert) => {
    const created = new Date(alert.dataCriacao);
    const resolved = alert.dataResolucao ? new Date(alert.dataResolucao) : null;
    return created <= periodEnd && (resolved === null || resolved >= periodStart);
  });

  return {
    client: baseReport.client,
    transactions: filteredTransactions,
    alerts: filteredAlerts,
  };
}

export function getMockAllReports(
  startDate?: string,
  endDate?: string
): ClientReport[] {
  if (!startDate || !endDate) {
    return reports;
  }

  const periodStart = new Date(`${startDate}T00:00:00`);
  const periodEnd = new Date(`${endDate}T23:59:59`);

  return reports.map((report) => {
    const filteredTransactions = report.transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.dateTime);
      return transactionDate >= periodStart && transactionDate <= periodEnd;
    });

    const filteredAlerts = report.alerts.filter((alert) => {
      const created = new Date(alert.dataCriacao);
      const resolved = alert.dataResolucao ? new Date(alert.dataResolucao) : null;
      return created <= periodEnd && (resolved === null || resolved >= periodStart);
    });

    return {
      client: report.client,
      transactions: filteredTransactions,
      alerts: filteredAlerts,
    };
  });
}
