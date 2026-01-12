import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FlagImage } from "@/components/ui/flagImage";
import { InfoIcon, ArrowUpRight } from "lucide-react";
import type { AlertSeverity, AlertStatus, Alert, ClientReport, Transaction, TransactionType } from "@/mocks/reportsMock";
import type { ColumnDef } from "@/components/table/dataTable";
import { getColorByStatus, formatMoney, formatDateTime } from "@/lib/utils";

function getBadgeStyleByRisk(risk: "Baixo" | "Médio" | "Alto") {
  const statusMap: Record<"Baixo" | "Médio" | "Alto", string> = {
    Baixo: "low",
    Médio: "medium",
    Alto: "high",
  };
  const colors = getColorByStatus(statusMap[risk]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

function getBadgeStyleByKyc(kyc: "Aprovado" | "Pendente" | "Reprovado") {
  const statusMap: Record<"Aprovado" | "Pendente" | "Reprovado", string> = {
    Aprovado: "approved",
    Pendente: "pending",
    Reprovado: "rejected",
  };
  const colors = getColorByStatus(statusMap[kyc]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

function getBadgeStyleBySeverity(severity: AlertSeverity) {
  const statusMap: Record<AlertSeverity, string> = {
    Crítica: "critical",
    Alta: "high",
    Média: "medium",
    Baixa: "low",
  };
  const colors = getColorByStatus(statusMap[severity]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

function getBadgeStyleByStatus(status: AlertStatus) {
  const statusMap: Record<AlertStatus, string> = {
    Resolvido: "resolved",
    "Em Análise": "in-review",
    Novo: "new",
  };
  const colors = getColorByStatus(statusMap[status]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

export function getReportsColumns(): ColumnDef<ClientReport>[] {
  return [
    {
      key: "client",
      label: "Cliente",
      render: (report) => (
        <span className="font-medium">{report.client.name}</span>
      ),
    },
    {
      key: "country",
      label: "País",
      render: (report) => (
        <div className="flex items-center gap-2">
          <FlagImage country={report.client.country} className="size-4" />
          <span>{report.client.country}</span>
        </div>
      ),
    },
    {
      key: "riskLevel",
      label: "Nível de Risco",
      render: (report) => (
        <Badge style={getBadgeStyleByRisk(report.client.riskLevel)}>
          {report.client.riskLevel}
        </Badge>
      ),
    },
    {
      key: "kycStatus",
      label: "Status KYC",
      render: (report) => (
        <Badge style={getBadgeStyleByKyc(report.client.kycStatus)}>
          {report.client.kycStatus}
        </Badge>
      ),
    },
    {
      key: "transactions",
      label: "Transações",
      render: (report) => report.transactions.length,
    },
    {
      key: "alerts",
      label: "Alertas",
      render: (report) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help w-fit">
              <span>{report.alerts.length}</span>
              <InfoIcon className="size-3.5 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5 p-4">
              {(["Crítica", "Alta", "Média", "Baixa"] as AlertSeverity[]).map(
                (severity) => {
                  const count = report.alerts.filter(
                    (alert) => alert.severity === severity
                  ).length;
                  if (count === 0) return null;
                  return (
                    <div key={severity} className="flex items-center gap-2">
                      <span>{count}x</span>
                      <Badge style={getBadgeStyleBySeverity(severity)}>
                        {severity}
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      headerClassName: "text-right",
      className: "text-right",
      render: (report) => (
        <div className="flex items-center justify-end cursor-pointer px-2">
          <Link href={`/reports/${report.client.id}`}>
            <ArrowUpRight className="size-5 text-primary" />
          </Link>
        </div>
      ),
    },
  ];
}

export type TransactionSummaryRow = {
  type: TransactionType;
  count: number;
  total: number;
  average: number;
};

export function getTransactionSummaryColumns(
  selectedCurrency: "BRL" | "USD" | "EUR"
): ColumnDef<TransactionSummaryRow>[] {
  return [
    {
      key: "type",
      label: "Tipo",
      className: "py-3 pr-4",
      headerClassName: "py-3 pr-4",
      render: (row) => row.type,
    },
    {
      key: "count",
      label: "Quantidade",
      className: "py-3 pr-4",
      headerClassName: "py-3 pr-4",
      render: (row) => row.count,
    },
    {
      key: "total",
      label: "Total",
      className: "py-3 pr-4",
      headerClassName: "py-3 pr-4",
      render: (row) => formatMoney(row.total, selectedCurrency),
    },
    {
      key: "average",
      label: "Média",
      className: "py-3 pr-4",
      headerClassName: "py-3 pr-4",
      render: (row) => formatMoney(row.average, selectedCurrency),
    },
  ];
}

export function getAlertsColumns(): ColumnDef<Alert>[] {
  return [
    {
      key: "id",
      label: "ID",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) => alert.id,
    },
    {
      key: "transactionId",
      label: "ID da Transação",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) => alert.transactionId,
    },
    {
      key: "rule",
      label: "Regra",
      className: "py-3 pr-4 min-w-[260px]",
      headerClassName: "py-3 pr-4",
      render: (alert) => alert.rule,
    },
    {
      key: "severity",
      label: "Severidade",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) => (
        <span
          className="text-xs px-2 py-1 rounded"
          style={getBadgeStyleBySeverity(alert.severity)}
        >
          {alert.severity}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) => (
        <span
          className="text-xs px-2 py-1 rounded"
          style={getBadgeStyleByStatus(alert.status)}
        >
          {alert.status}
        </span>
      ),
    },
    {
      key: "dataCriacao",
      label: "Data de Criação",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) => formatDateTime(alert.dataCriacao),
    },
    {
      key: "dataResolucao",
      label: "Data de Resolução",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (alert) =>
        alert.dataResolucao ? formatDateTime(alert.dataResolucao) : "-",
    },
  ];
}

export function getTransactionsColumns(): ColumnDef<Transaction>[] {
  return [
    {
      key: "id",
      label: "ID",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.id,
    },
    {
      key: "type",
      label: "Tipo",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.type,
    },
    {
      key: "amount",
      label: "Valor",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatMoney(transaction.amount, transaction.currency),
    },
    {
      key: "counterparty",
      label: "Contraparte",
      className: "py-3 pr-4 min-w-[220px]",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.counterparty,
    },
    {
      key: "dateTime",
      label: "DataHora",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatDateTime(transaction.dateTime),
    },
  ];
}

// Export helper functions for use in other components
export { getBadgeStyleByRisk, getBadgeStyleByKyc, getBadgeStyleBySeverity, getBadgeStyleByStatus };
