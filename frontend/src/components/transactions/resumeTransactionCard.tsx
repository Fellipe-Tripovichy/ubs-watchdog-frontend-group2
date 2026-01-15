import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/utils";
import type { TransactionSummaryRow } from "@/models/reports";

interface ResumeTransactionCardProps {
  transaction: TransactionSummaryRow;
  currency: "BRL" | "USD" | "EUR";
}

export function ResumeTransactionCard({ transaction, currency }: ResumeTransactionCardProps) {
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
                Quantidade
              </span>
              <span className="text-sm font-medium">
                {transaction.count}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Total
              </span>
              <span className="text-sm font-medium">
                {formatMoney(transaction.total, currency)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Média
              </span>
              <span className="text-sm font-medium">
                {formatMoney(transaction.average, currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
