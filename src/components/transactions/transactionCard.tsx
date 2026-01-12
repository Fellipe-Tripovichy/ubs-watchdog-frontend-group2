import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatMoney, formatDateTime } from "@/lib/utils";
import type { Transaction } from "@/mocks/reportsMock";

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg">
          {transaction.type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-6 pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                ID
              </span>
              <span className="text-sm font-medium">
                {transaction.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Valor
              </span>
              <span className="text-sm font-medium">
                {formatMoney(transaction.amount, transaction.currency)}
              </span>
            </div>
          </div>
          <div className="pb-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Contraparte
              </span>
              <span className="text-sm font-medium">
                {transaction.counterparty}
              </span>
            </div>
          </div>
          <div className="pt-4 border-t border-muted">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                DataHora
              </span>
              <span className="text-sm font-medium">
                {formatDateTime(transaction.dateTime)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
