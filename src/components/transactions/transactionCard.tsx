import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { formatMoney, formatDate } from "@/lib/utils";
import type { Transaction } from "@/features/transactions/transactionsAPI";
import { CopyButton } from "../ui/copyButton";
import Link from "next/link";
import { LinkButton } from "../ui/linkButton";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg">
          {transaction.tipo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
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
          </div>
          <div className="pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Contraparte
              </span>
              <span className="text-sm font-medium">
                {transaction.contraparte || "-"}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-muted">
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
        <CardAction>
          <LinkButton icon="chevron-right" iconLeft={false} asChild>
            <Link href={`/transactions/${transaction.id}`}>Ver mais</Link>
          </LinkButton>
        </CardAction>
      </CardContent>
    </Card>
  );
}
