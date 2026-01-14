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
  { code: "GBP", fullName: "Libra Esterlina", countryCode: "gb", symbol: "£" },
  { code: "JPY", fullName: "Iene", countryCode: "jp", symbol: "¥" },
  { code: "CNY", fullName: "Yuan", countryCode: "cn", symbol: "¥" }, 
  { code: "CHF", fullName: "Franco Suíço", countryCode: "ch", symbol: "CHF" },
  { code: "CAD", fullName: "Dólar Canadense", countryCode: "ca", symbol: "C$" },
  { code: "AUD", fullName: "Dólar Australiano", countryCode: "au", symbol: "A$" },
  { code: "NZD", fullName: "Dólar da Nova Zelândia", countryCode: "nz", symbol: "NZ$" },
  { code: "BRL", fullName: "Real", countryCode: "br", symbol: "R$" },
  { code: "MXN", fullName: "Peso Mexicano", countryCode: "mx", symbol: "Mex$" },
  { code: "ARS", fullName: "Peso Argentino", countryCode: "ar", symbol: "AR$" },
  { code: "CLP", fullName: "Peso Chileno", countryCode: "cl", symbol: "CLP$" },
  { code: "COP", fullName: "Peso Colombiano", countryCode: "co", symbol: "COP$" },
  { code: "PEN", fullName: "Sol", countryCode: "pe", symbol: "S/" },
  { code: "INR", fullName: "Rupia Indiana", countryCode: "in", symbol: "₹" },
  { code: "KRW", fullName: "Won Sul-Coreano", countryCode: "kr", symbol: "₩" },
  { code: "SGD", fullName: "Dólar de Singapura", countryCode: "sg", symbol: "S$" },
  { code: "HKD", fullName: "Dólar de Hong Kong", countryCode: "hk", symbol: "HK$" },
  { code: "SEK", fullName: "Coroa Sueca", countryCode: "se", symbol: "kr" },
  { code: "NOK", fullName: "Coroa Norueguesa", countryCode: "no", symbol: "kr" },
  { code: "DKK", fullName: "Coroa Dinamarquesa", countryCode: "dk", symbol: "kr" },
  { code: "PLN", fullName: "Zloty", countryCode: "pl", symbol: "zł" },
  { code: "RUB", fullName: "Rublo", countryCode: "ru", symbol: "₽" },
  { code: "TRY", fullName: "Lira Turca", countryCode: "tr", symbol: "₺" },
  { code: "ZAR", fullName: "Rand", countryCode: "za", symbol: "R" },
  { code: "AED", fullName: "Dirham dos Emirados", countryCode: "ae", symbol: "د.إ" },
  { code: "SAR", fullName: "Riyal Saudita", countryCode: "sa", symbol: "ر.س" },
  { code: "ILS", fullName: "Shekel", countryCode: "il", symbol: "₪" },
  { code: "THB", fullName: "Baht", countryCode: "th", symbol: "฿" },
  { code: "MYR", fullName: "Ringgit", countryCode: "my", symbol: "RM" },
  { code: "IDR", fullName: "Rupia Indonésia", countryCode: "id", symbol: "Rp" },
  { code: "PHP", fullName: "Peso Filipino", countryCode: "ph", symbol: "₱" },
  { code: "VND", fullName: "Dong", countryCode: "vn", symbol: "₫" },
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
