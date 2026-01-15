import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { formatMoney, formatDate, getColorByStatus } from "@/lib/utils";
import type { Transaction } from "@/features/transactions/transactionsAPI";
import { CopyButton } from "../ui/copyButton";
import Link from "next/link";
import { LinkButton } from "../ui/linkButton";
import { CURRENCIES } from "@/models/transactions";
import { Badge } from "../ui/badge";

interface TransactionCardProps {
  transaction: Transaction;
}

function getAlertBadgeStyle(quantidadeAlertas: number) {
  if (quantidadeAlertas > 0 && quantidadeAlertas < 3) {
    return {
      backgroundColor: getColorByStatus("warning").light,
      color: getColorByStatus("warning").foreground,
    };
  }
  if (quantidadeAlertas >= 3) {
    return {
      backgroundColor: getColorByStatus("negative").light,
      color: getColorByStatus("negative").foreground,
    };
  }
  return {
    backgroundColor: getColorByStatus("success").light,
    color: getColorByStatus("success").foreground,
  };
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="gap-2 h-full flex flex-col items-end justify-between w-full">
      <CardHeader className="w-full">
        <CardTitle className="flex items-center gap-2 justify-between">
          <h3 className="text-h3 font-regular">{transaction.tipo}</h3>
          <Badge variant="outline" style={getAlertBadgeStyle(transaction.quantidadeAlertas)}>
            {transaction.quantidadeAlertas} alertas
          </Badge>
        </CardTitle>
      </CardHeader> 
      <CardContent className="h-full flex flex-col items-end justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-2 gap-6 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                ID
              </span>
              <div className="flex items-center gap-2 justify-between">
                <p>{transaction.id.slice(0, 4)}...{transaction.id.slice(-4)}</p>
                <CopyButton textToCopy={transaction.id} variant="secondary" size="small" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Valor
              </span>
              <span className="text-sm font-medium">
                {formatMoney(transaction.valor, transaction.moeda)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Moeda
              </span>
              <span className="text-sm font-medium">
                {CURRENCIES.find((currency) => currency.code === transaction.moeda)?.fullName ?? "-"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                DataHora
              </span>
              <span className="text-sm font-medium">
                {formatDate(transaction.dataHora)}
              </span>
            </div>
          </div>
        </div>
        <CardAction className="mt-4">
          <LinkButton icon="chevron-right" iconLeft={false} asChild>
            <Link href={`/transactions/${transaction.id}`}>Ver mais</Link>
          </LinkButton>
        </CardAction>
      </CardContent>
    </Card>
  );
}
