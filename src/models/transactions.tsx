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
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", fullName: "Dólar", countryCode: "us" },
  { code: "EUR", fullName: "Euro", countryCode: "eu" },
  { code: "GBP", fullName: "Libra Esterlina", countryCode: "gb" },
  { code: "JPY", fullName: "Iene", countryCode: "jp" },
  { code: "CNY", fullName: "Yuan", countryCode: "cn" }, 
  { code: "CHF", fullName: "Franco Suíço", countryCode: "ch" },
  { code: "CAD", fullName: "Dólar Canadense", countryCode: "ca" },
  { code: "AUD", fullName: "Dólar Australiano", countryCode: "au" },
  { code: "NZD", fullName: "Dólar da Nova Zelândia", countryCode: "nz" },
  { code: "BRL", fullName: "Real", countryCode: "br" },
  { code: "MXN", fullName: "Peso Mexicano", countryCode: "mx" },
  { code: "ARS", fullName: "Peso Argentino", countryCode: "ar" },
  { code: "CLP", fullName: "Peso Chileno", countryCode: "cl" },
  { code: "COP", fullName: "Peso Colombiano", countryCode: "co" },
  { code: "PEN", fullName: "Sol", countryCode: "pe" },
  { code: "INR", fullName: "Rupia Indiana", countryCode: "in" },
  { code: "KRW", fullName: "Won Sul-Coreano", countryCode: "kr" },
  { code: "SGD", fullName: "Dólar de Singapura", countryCode: "sg" },
  { code: "HKD", fullName: "Dólar de Hong Kong", countryCode: "hk" },
  { code: "SEK", fullName: "Coroa Sueca", countryCode: "se" },
  { code: "NOK", fullName: "Coroa Norueguesa", countryCode: "no" },
  { code: "DKK", fullName: "Coroa Dinamarquesa", countryCode: "dk" },
  { code: "PLN", fullName: "Zloty", countryCode: "pl" },
  { code: "RUB", fullName: "Rublo", countryCode: "ru" },
  { code: "TRY", fullName: "Lira Turca", countryCode: "tr" },
  { code: "ZAR", fullName: "Rand", countryCode: "za" },
  { code: "AED", fullName: "Dirham dos Emirados", countryCode: "ae" },
  { code: "SAR", fullName: "Riyal Saudita", countryCode: "sa" },
  { code: "ILS", fullName: "Shekel", countryCode: "il" },
  { code: "THB", fullName: "Baht", countryCode: "th" },
  { code: "MYR", fullName: "Ringgit", countryCode: "my" },
  { code: "IDR", fullName: "Rupia Indonésia", countryCode: "id" },
  { code: "PHP", fullName: "Peso Filipino", countryCode: "ph" },
  { code: "VND", fullName: "Dong", countryCode: "vn" },
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
      render: (transaction) => transaction.moeda,
    },
    {
      key: "contraparte",
      label: "Contraparte",
      className: "py-3 pr-4 min-w-[220px]",
      headerClassName: "py-3 pr-4",
      render: (transaction) => transaction.contraparte || "-",
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
