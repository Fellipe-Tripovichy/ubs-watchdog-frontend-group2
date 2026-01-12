import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { getBadgeStyleBySeverity, getBadgeStyleByStatus } from "@/models/reports";
import type { Alert } from "@/mocks/reportsMock";

interface ComplianceCardProps {
  alert: Alert;
}

export function ComplianceCard({ alert }: ComplianceCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-lg">
          {alert.rule}
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
                {alert.id}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                ID da Transação
              </span>
              <span className="text-sm font-medium">
                {alert.transactionId}
              </span>
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
                  {formatDateTime(alert.dataCriacao)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">
                  Data de Resolução
                </span>
                <span className="text-sm font-medium">
                  {alert.dataResolucao ? formatDateTime(alert.dataResolucao) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
