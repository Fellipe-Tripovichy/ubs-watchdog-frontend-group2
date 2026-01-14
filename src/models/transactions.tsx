import type { ColumnDef } from "@/components/table/dataTable";
import { CopyButton } from "@/components/ui/copyButton";
import type { Transaction } from "@/features/transactions/transactionsAPI";
import { formatMoney, formatDateTime } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export interface CurrencyInfo {
  code: string;
  fullName: string;
  countryCode: string;
  symbol: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", fullName: "Dólar", countryCode: "us", symbol: "$" },
  { code: "EUR", fullName: "Euro", countryCode: "eu", symbol: "€" },
  { code: "BRL", fullName: "Real", countryCode: "br", symbol: "R$" },
];

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    Transferencia: "Transferência",
    Deposito: "Depósito",
    Saque: "Saque",
  };
  return map[type];
}

export function getTransactionsColumns(): ColumnDef<Transaction>[] {
  return [
    {
      key: "id",
      label: "ID",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => (
        <div className="flex items-center gap-2 justify-between">
          <p>{transaction.id.slice(0, 4)}...{transaction.id.slice(-4)}</p>
          <CopyButton textToCopy={transaction.id} variant="secondary" size="small" />
        </div>
      ),
    },
    {
      key: "tipo",
      label: "Tipo",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => getTypeLabel(transaction.tipo),
    },
    {
      key: "valor",
      label: "Valor",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatMoney(transaction.valor, transaction.moeda),
    },
    {
      key: "moeda",
      label: "Moeda",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => CURRENCIES.find((currency) => currency.code === transaction.moeda)?.fullName ?? "-",
    },
    {
      key: "dataHora",
      label: "DataHora",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => formatDateTime(transaction.dataHora),
    },
    {
      key: "quantidadeAlertas",
      label: "Alertas",
      className: "py-3 pr-4 whitespace-nowrap",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.quantidadeAlertas,
    },
    {
        key: "details",
        label: "Detalhes",
        headerClassName: "text-right",
        className: "text-right",
        render: (transaction) => (
          <div className="flex items-center justify-end cursor-pointer px-2">
            <Link href={`/transactions/${transaction.id}`}>
              <ArrowUpRight className="size-5 text-primary" />
            </Link>
          </div>
        ),
      },
  ];
}
