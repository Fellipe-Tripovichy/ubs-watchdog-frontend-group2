import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getBadgeStyleBySeverity, getBadgeStyleByStatus, type DisplayAlert } from "@/models/complience";
import { CopyButton } from "../ui/copyButton";
import Link from "next/link";
import { LinkButton } from "../ui/linkButton";

interface ComplianceCardProps {
  alert: DisplayAlert;
}

export function ComplianceCard({ alert }: ComplianceCardProps) {
  return (
    <Card className="gap-2 h-full flex flex-col items-end justify-between w-full">
      <CardHeader className="w-full">
        <CardTitle className="text-lg">
          {alert.rule}
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
                <p>{alert.id.slice(0, 4)}...{alert.id.slice(-4)}</p>
                <CopyButton textToCopy={alert.id} variant="secondary" size="small" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                ID da Transação
              </span>
              <div className="flex items-center gap-2 justify-between">
                <p>{alert.transactionId.slice(0, 4)}...{alert.transactionId.slice(-4)}</p>
                <CopyButton textToCopy={alert.transactionId} variant="secondary" size="small" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Severidade
              </span>
              <Badge style={getBadgeStyleBySeverity(alert.severity)}>
                {alert.severity}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Status
              </span>
              <Badge style={getBadgeStyleByStatus(alert.status)}>
                {alert.status}
              </Badge>
            </div>
          </div>
          <div className="pt-4 border-t border-muted">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Data de Criação
                </span>
                <span className="text-sm font-medium">
                  {formatDate(alert.dataCriacao)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Data de Resolução
                </span>
                <span className="text-sm font-medium">
                  {alert.dataResolucao ? formatDate(alert.dataResolucao) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <CardAction className="mt-4">
          <LinkButton icon="chevron-right" iconLeft={false} asChild>
            <Link href={`/compliance/${alert.id}`}>Ver mais</Link>
          </LinkButton>
        </CardAction> 
      </CardContent>
    </Card>
  );
}
