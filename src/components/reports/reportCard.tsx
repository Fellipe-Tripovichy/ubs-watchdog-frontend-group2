import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { FlagImage } from "@/components/ui/flagImage";
import { LinkButton } from "@/components/ui/linkButton";
import { getBadgeStyleByRisk, getBadgeStyleByKyc } from "@/models/reports";
import type { ClientReport } from "@/mocks/reportsMock";

interface ReportCardProps {
  report: ClientReport;
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {report.client.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex flex-col items-start justify-center gap-2 pb-4">
            <p className="text-caption text-muted-foreground">Nacionalidade</p>
            <div className="flex items-center gap-2">
              <FlagImage
                country={report.client.country}
                className="size-4"
              />
              <p className="text-body text-foreground">
                {report.client.country}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pb-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Nível de Risco
              </span>
              <Badge
                style={getBadgeStyleByRisk(
                  report.client.riskLevel
                )}
              >
                {report.client.riskLevel}
              </Badge>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground">
                Status KYC
              </span>
              <Badge
                style={getBadgeStyleByKyc(
                  report.client.kycStatus
                )}
              >
                {report.client.kycStatus}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-muted">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Transações
              </span>
              <span className="text-sm font-medium">
                {report.transactions.length}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Alertas
              </span>
              <div className="flex items-center gap-2 cursor-help w-fit">
                <span className="text-sm font-medium">
                  {report.alerts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <CardAction>
          <LinkButton icon="chevron-right" iconLeft={false} asChild>
            <Link href={`/reports/${report.client.id}`}>Ver mais</Link>
          </LinkButton>
        </CardAction>
      </CardContent>
    </Card>
  );
}
