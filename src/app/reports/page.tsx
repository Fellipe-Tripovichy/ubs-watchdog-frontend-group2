"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import { DatePickerInput } from "@/components/ui/datePickerInput";
import { Spinner } from "@/components/ui/spinner";

// MOCK
import {
  getMockClientReport,
  listMockClients,
  type TransactionType,
  type AlertSeverity,
} from "@/mocks/reportsMock";

const SEVERITY_PIE_COLOR: Record<AlertSeverity, string> = {
  Crítica: "#f87171", // red-400
  Alta: "#fb923c", // orange-400
  Média: "#fbbf24", // amber-400
  Baixa: "#94a3b8", // slate-400
};

function isoToDate(iso: string): Date {
  // ISO esperado: YYYY-MM-DD (sem timezone)
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dateToISO(date: Date): string {
  return toISODateLocal(date);
}

function toISODateLocal(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfCurrentMonthISO() {
  const now = new Date();
  return toISODateLocal(new Date(now.getFullYear(), now.getMonth(), 1));
}

function todayISO() {
  return toISODateLocal(new Date());
}

function parseISODateStart(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`);
}

function parseISODateEnd(isoDate: string) {
  return new Date(`${isoDate}T23:59:59`);
}

function formatDate(isoDate: string) {
  const dt = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR").format(dt);
}

function formatDateTime(iso: string) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(dt);
}

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

function badgeClassByRisk(risk: "Baixo" | "Médio" | "Alto") {
  if (risk === "Alto") return "bg-red-100 text-red-900";
  if (risk === "Médio") return "bg-amber-100 text-amber-900";
  // Baixo
  return "bg-emerald-100 text-emerald-900";
}

function badgeClassByKyc(kyc: "Aprovado" | "Pendente" | "Reprovado") {
  if (kyc === "Aprovado") return "bg-emerald-100 text-emerald-900";
  if (kyc === "Pendente") return "bg-sky-100 text-sky-900";
  // Reprovado
  return "bg-red-100 text-red-900";
}

function badgeClassBySeverity(sev: AlertSeverity) {
  if (sev === "Crítica") return "bg-red-100 text-red-900";
  if (sev === "Alta") return "bg-orange-200 text-orange-900";
  if (sev === "Média") return "bg-amber-100 text-amber-900";
  // Baixa
  return "bg-slate-200 text-slate-900";
}

function badgeClassByStatus(status: "Novo" | "Em Análise" | "Resolvido") {
  if (status === "Resolvido") return "bg-emerald-100 text-emerald-900";
  if (status === "Em Análise") return "bg-amber-100 text-amber-900";
  // Novo
  return "bg-sky-100 text-sky-900";
}

function PlainField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}

export default function ReportsPage() {
  const clients = React.useMemo(() => listMockClients(), []);
  const [clientId, setClientId] = React.useState(clients[0]?.id ?? "C-1023");

  // default: início = 1º dia do mês, fim = hoje
  const [startDate, setStartDate] = React.useState<string>(
    startOfCurrentMonthISO()
  );
  const [endDate, setEndDate] = React.useState<string>(todayISO());

  const [isLoading, setIsLoading] = React.useState(false);

  const report = React.useMemo(() => getMockClientReport(clientId), [clientId]);

  // regra: se usuário limpar a data fim, vira hoje
  React.useEffect(() => {
    if (!startDate) return;
    if (!endDate) setEndDate(todayISO());
  }, [startDate, endDate]);

  // regra: fim >= início
  React.useEffect(() => {
    if (!startDate || !endDate) return;
    if (endDate < startDate)
      setEndDate(todayISO() >= startDate ? todayISO() : startDate);
  }, [startDate, endDate]);

  const isValidRange =
    Boolean(startDate) && Boolean(endDate) && endDate >= startDate;

  const periodStart = React.useMemo(
    () => parseISODateStart(startDate),
    [startDate]
  );
  const periodEnd = React.useMemo(() => parseISODateEnd(endDate), [endDate]);

  React.useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, [clientId, startDate, endDate]);

  const filteredTransactions = React.useMemo(() => {
    if (!isValidRange) return [];
    return report.transactions.filter((t) => {
      const dt = new Date(t.dateTime);
      return dt >= periodStart && dt <= periodEnd;
    });
  }, [report.transactions, isValidRange, periodStart, periodEnd]);

  // alertas “ativos no período”:
  // dataCriacao <= fim  &&  (dataResolucao null || dataResolucao >= início)
  const filteredAlerts = React.useMemo(() => {
    if (!isValidRange) return [];
    return report.alerts.filter((a) => {
      const created = new Date(a.dataCriacao);
      const resolved = a.dataResolucao ? new Date(a.dataResolucao) : null;
      return (
        created <= periodEnd && (resolved === null || resolved >= periodStart)
      );
    });
  }, [report.alerts, isValidRange, periodStart, periodEnd]);

  const currencies = React.useMemo(() => {
    const set = new Set(filteredTransactions.map((t) => t.currency));
    return Array.from(set);
  }, [filteredTransactions]);

  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("BRL");

  React.useEffect(() => {
    const next = currencies[0] ?? "BRL";
    if (!currencies.includes(selectedCurrency)) setSelectedCurrency(next);
  }, [currencies, selectedCurrency]);

  const txInCurrency = React.useMemo(() => {
    return filteredTransactions.filter((t) => t.currency === selectedCurrency);
  }, [filteredTransactions, selectedCurrency]);

  const totalMovedSelectedCurrency = React.useMemo(() => {
    return txInCurrency.reduce((acc, t) => acc + t.amount, 0);
  }, [txInCurrency]);

  const totalsByCurrency = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filteredTransactions) {
      map.set(t.currency, (map.get(t.currency) ?? 0) + t.amount);
    }
    return Array.from(map.entries()).map(([currency, total]) => ({
      currency,
      total,
    }));
  }, [filteredTransactions]);

  const totalsByType = React.useMemo(() => {
    const types: TransactionType[] = ["Depósito", "Saque", "Transferência"];
    const map: Record<TransactionType, { count: number; total: number }> = {
      Depósito: { count: 0, total: 0 },
      Saque: { count: 0, total: 0 },
      Transferência: { count: 0, total: 0 },
    };

    for (const tx of txInCurrency) {
      map[tx.type].count += 1;
      map[tx.type].total += tx.amount;
    }

    return types.map((type) => ({
      type,
      count: map[type].count,
      total: map[type].total,
      average: map[type].count ? map[type].total / map[type].count : 0,
    }));
  }, [txInCurrency]);

  const barData = totalsByType.map((x) => ({ name: x.type, total: x.total }));

  const alertsBySeverity = React.useMemo(() => {
    const order: AlertSeverity[] = ["Crítica", "Alta", "Média", "Baixa"];
    const map: Record<AlertSeverity, number> = {
      Crítica: 0,
      Alta: 0,
      Média: 0,
      Baixa: 0,
    };
    for (const a of filteredAlerts) map[a.severity] += 1;
    return order
      .map((sev) => ({ name: sev, value: map[sev] }))
      .filter((x) => x.value > 0);
  }, [filteredAlerts]);

  const periodLabel = isValidRange
    ? `${formatDate(startDate)} a ${formatDate(endDate)}`
    : "-";

  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full max-w-[1554px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-[28px] md:text-[40px] font-regular text-foreground">
              Relatórios
            </h1>
            <div className="h-1 w-20 bg-primary mt-3"></div>
            <p className="text-[16px] text-muted-foreground mt-6">
              Perfil do cliente + resumo de transações + alertas. Selecione um
              período para visualizar totais, gráficos e tabelas.
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-secondary p-6 rounded-md">
            <h2 className="text-[24px] font-regular text-secondary-foreground mb-4">
              Filtros
            </h2>
            <div className="flex flex-col gap-4">
              {/* LINHA DE CIMA: Cliente (2 colunas) + Moeda (1 coluna) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1 w-full md:col-span-2">
                  <span className="text-sm text-muted-foreground">Cliente</span>

                  <select
                    id="clientSelect"
                    className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <span className="text-sm text-muted-foreground">Moeda</span>

                  {currencies.length > 1 ? (
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground"
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                    >
                      {currencies.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-foreground mt-1">
                      {currencies[0] ?? "—"}
                    </p>
                  )}
                </div>
              </div>

              {/* LINHA DE BAIXO: Data início + Data fim + Período (3 colunas iguais) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <DatePickerInput
                  label="Data início"
                  value={isoToDate(startDate)}
                  maxDate={isoToDate(todayISO())}
                  onChange={(d) => {
                    // se apagar, volta pro padrão (1º dia do mês)
                    const nextStart = d
                      ? dateToISO(d)
                      : startOfCurrentMonthISO();
                    setStartDate(nextStart);

                    // regra: se mexer no início e fim ficar inválido, ajusta o fim
                    const today = todayISO();
                    if (!endDate || endDate < nextStart)
                      setEndDate(today >= nextStart ? today : nextStart);
                  }}
                />

                <DatePickerInput
                  label="Data fim"
                  value={isoToDate(endDate)}
                  minDate={isoToDate(startDate)}
                  maxDate={isoToDate(todayISO())}
                  onChange={(d) => {
                    // se apagar, volta pra hoje 
                    const nextEnd = d != null ? dateToISO(d) : todayISO();
                    setEndDate(nextEnd);
                  }}
                />

                <PlainField label="Período" value={periodLabel} />
              </div>

              {!isValidRange && (
                <p className="text-sm text-destructive">
                  Período inválido. Ajuste as datas para carregar o relatório.
                </p>
              )}
            </div>

            {/* LINHA 3: ações */}
            <div className="flex justify-start mt-4">
              <Button
                variant="secondary"
                size="small"
                showArrow={false}
                type="button"
                onClick={() => {
                  setStartDate(startOfCurrentMonthISO());
                  setEndDate(todayISO());
                }}
              >
                Resetar período
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="bg-secondary p-4 rounded-md flex items-center gap-2">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Atualizando relatório...
              </p>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary p-6 rounded-md">
              <p className="text-sm text-muted-foreground">
                Total movimentado no período
              </p>
              <p className="text-3xl text-foreground mt-2">
                {formatMoney(totalMovedSelectedCurrency, selectedCurrency)}
              </p>

              {totalsByCurrency.length > 1 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Totais por moeda:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {totalsByCurrency.map((x) => (
                      <span
                        key={x.currency}
                        className="text-xs px-2 py-1 rounded bg-muted text-foreground"
                      >
                        {x.currency}: {formatMoney(x.total, x.currency)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-secondary p-6 rounded-md">
              <p className="text-sm text-muted-foreground">
                Nº de alertas ativos no período
              </p>
              <p className="text-3xl text-foreground mt-2">
                {filteredAlerts.length}
              </p>
            </div>
          </div>

          {/* Perfil */}
          <div className="bg-secondary p-6 rounded-md">
            <h2 className="text-[24px] font-regular text-secondary-foreground mb-4">
              Perfil do cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="text-sm text-foreground mt-1">
                  {report.client.id}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Nome</p>
                <p className="text-sm text-foreground mt-1">
                  {report.client.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">País</p>
                <p className="text-sm text-foreground mt-1">
                  {report.client.country}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">Nível de Risco</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${badgeClassByRisk(
                    report.client.riskLevel
                  )}`}
                >
                  {report.client.riskLevel}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">KYC Status</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${badgeClassByKyc(
                    report.client.kycStatus
                  )}`}
                >
                  {report.client.kycStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-secondary p-6 rounded-md">
              <h2 className="text-[20px] font-regular text-secondary-foreground">
                Movimentação por tipo ({selectedCurrency})
              </h2>
              <div className="h-[320px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) =>
                        formatMoney(Number(value), selectedCurrency)
                      }
                      labelFormatter={(label) => `Tipo: ${label}`}
                    />
                    <Bar
                      dataKey="total"
                      name="Total"
                      fill="var(--chart-2)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-secondary p-6 rounded-md">
              <h2 className="text-[20px] font-regular text-secondary-foreground">
                Alertas por severidade
              </h2>
              <div className="h-[320px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={alertsBySeverity}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label
                    >
                      {alertsBySeverity.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={SEVERITY_PIE_COLOR[entry.name as AlertSeverity]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => String(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tabela resumo transações */}
          <div className="bg-secondary p-6 rounded-md">
            <h2 className="text-[20px] font-regular text-secondary-foreground mb-4">
              Resumo de transações ({selectedCurrency})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Tipo
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Quantidade
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Total
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Média
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {totalsByType.map((row) => (
                    <tr key={row.type} className="border-b border-border/60">
                      <td className="py-3 pr-4 text-foreground">{row.type}</td>
                      <td className="py-3 pr-4 text-foreground">{row.count}</td>
                      <td className="py-3 pr-4 text-foreground">
                        {formatMoney(row.total, selectedCurrency)}
                      </td>
                      <td className="py-3 pr-4 text-foreground">
                        {formatMoney(row.average, selectedCurrency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela alertas */}
          <div className="bg-secondary p-6 rounded-md">
            <h2 className="text-[20px] font-regular text-secondary-foreground mb-4">
              Alertas ativos no período
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      ID
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      ID da Transação
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Regra
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Severidade
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Status
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Data de Criação
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Data de Resolução
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlerts.map((a) => (
                    <tr key={a.id} className="border-b border-border/60">
                      <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                        {a.id}
                      </td>
                      <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                        {a.transactionId}
                      </td>
                      <td className="py-3 pr-4 text-foreground min-w-[260px]">
                        {a.rule}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${badgeClassBySeverity(
                            a.severity
                          )}`}
                        >
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded ${badgeClassByStatus(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                        {formatDateTime(a.dataCriacao)}
                      </td>
                      <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                        {a.dataResolucao
                          ? formatDateTime(a.dataResolucao)
                          : "-"}
                      </td>
                    </tr>
                  ))}

                  {filteredAlerts.length === 0 && (
                    <tr>
                      <td className="py-6 text-muted-foreground" colSpan={8}>
                        Nenhum alerta no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela detalhes transações */}
          <div className="bg-secondary p-6 rounded-md">
            <h2 className="text-[20px] font-regular text-secondary-foreground mb-4">
              Detalhes de Transações
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      ID
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Tipo
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Valor
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      Contraparte
                    </th>
                    <th className="py-3 pr-4 text-muted-foreground font-normal">
                      DataHora
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions
                    .slice()
                    .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1))
                    .map((t) => (
                      <tr key={t.id} className="border-b border-border/60">
                        <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                          {t.id}
                        </td>
                        <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                          {t.type}
                        </td>
                        <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                          {formatMoney(t.amount, t.currency)}
                        </td>
                        <td className="py-3 pr-4 text-foreground min-w-[220px]">
                          {t.counterparty}
                        </td>
                        <td className="py-3 pr-4 text-foreground whitespace-nowrap">
                          {formatDateTime(t.dateTime)}
                        </td>
                      </tr>
                    ))}

                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td className="py-6 text-muted-foreground" colSpan={7}>
                        Nenhuma transação no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
