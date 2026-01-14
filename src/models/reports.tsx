import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FlagImage } from "@/components/ui/flagImage";
import { InfoIcon, ArrowUpRight } from "lucide-react";
import type { ColumnDef } from "@/components/table/dataTable";
import { getColorByStatus, formatMoney, formatDateTime } from "@/lib/utils";
import { getBadgeStyleBySeverity } from "@/models/complience";
import type { Severidade } from "@/types/compliance";
import type { Report } from "@/features/reports/reportsSlice";
import type { Transaction } from "@/features/transactions/transactionsAPI";

type TransactionType = "Depósito" | "Saque" | "Transferência";

function getBadgeStyleByRisk(risk: "Baixo" | "Médio" | "Alto" | "Nenhum") {
  const statusMap: Record<"Baixo" | "Médio" | "Alto" | "Nenhum", string> = {
    Baixo: "low",
    Médio: "medium",
    Alto: "high",
    Nenhum: "neutral",
  };
  const colors = getColorByStatus(statusMap[risk as keyof typeof statusMap]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

function getBadgeStyleByKyc(kyc: "Aprovado" | "Pendente" | "Rejeitado" | "Nenhum") {
  const statusMap: Record<"Aprovado" | "Pendente" | "Rejeitado" | "Nenhum", string> = {
    Aprovado: "approved",
    Pendente: "pending",
    Rejeitado: "rejected",
    Nenhum: "neutral",
  };
  const colors = getColorByStatus(statusMap[kyc as keyof typeof statusMap]);
  return {
    backgroundColor: colors.light,
    color: colors.foreground,
  };
}

export function getReportsColumns(): ColumnDef<Report>[] {
  return [
    {
      key: "client",
      label: "Cliente",
      render: (report) => (
        <span className="font-medium">{report.nomeCliente}</span>
      ),
    },
    {
      key: "country",
      label: "País",
      render: (report) => (
        <div className="flex items-center gap-2">
          <FlagImage country={report.pais} className="size-4" />
          <span>{report.pais}</span>
        </div>
      ),
    },
    {
      key: "riskLevel",
      label: "Nível de Risco",
      render: (report) => (
        <Badge style={getBadgeStyleByRisk(report.nivelRisco as "Baixo" | "Médio" | "Alto" | "Nenhum")}>
          {report.nivelRisco}
        </Badge>
      ),
    },
    {
      key: "kycStatus",
      label: "Status KYC",
      render: (report) => (
        <Badge style={getBadgeStyleByKyc(report.statusKyc as "Aprovado" | "Pendente" | "Rejeitado" | "Nenhum")}>
          {report.statusKyc}
        </Badge>
      ),
    },
    {
      key: "transactions",
      label: "Transações",
      render: (report) => report.totalTransacoes,
    },
    {
      key: "alerts",
      label: "Alertas",
      render: (report) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help w-fit">
              <span>{report.totalAlertas}</span>
              <InfoIcon className="size-3.5 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5 p-4">
              {report.alertasCriticos > 0 && (
                <div className="flex items-center gap-2">
                  <span>{report.alertasCriticos}x</span>
                  <Badge style={getBadgeStyleBySeverity("Critica")}>
                    Crítica
                  </Badge>
                </div>
              )}
              {report.alertasEmAnalise > 0 && (
                <div className="flex items-center gap-2">
                  <span>{report.alertasEmAnalise}x</span>
                  <Badge style={getBadgeStyleBySeverity("Alta")}>
                    Em Análise
                  </Badge>
                </div>
              )}
              {report.alertasNovos > 0 && (
                <div className="flex items-center gap-2">
                  <span>{report.alertasNovos}x</span>
                  <Badge style={getBadgeStyleBySeverity("Media")}>
                    Novo
                  </Badge>
                </div>
              )}
              {report.alertasResolvidos > 0 && (
                <div className="flex items-center gap-2">
                  <span>{report.alertasResolvidos}x</span>
                  <Badge style={getBadgeStyleBySeverity("Baixa")}>
                    Resolvido
                  </Badge>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      key: "details",
      label: "Detalhes",
      headerClassName: "text-right",
      className: "text-right",
      render: (report) => (
        <div className="flex items-center justify-end cursor-pointer px-2">
          <Link href={`/reports/${report.clienteId}`}>
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
      render: (transaction) => transaction.tipo,
    },
    {
      key: "amount",
      label: "Valor",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatMoney(transaction.valor, transaction.moeda as "BRL" | "USD" | "EUR"),
    },
    {
      key: "counterparty",
      label: "Contraparte",
      className: "py-3 pr-4 min-w-[220px]",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.contraparte || "-",
    },
    {
      key: "dateTime",
      label: "DataHora",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatDateTime(transaction.dataHora),
    },
  ];
}

export { getBadgeStyleByRisk, getBadgeStyleByKyc };
