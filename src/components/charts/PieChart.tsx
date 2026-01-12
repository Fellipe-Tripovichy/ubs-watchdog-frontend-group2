"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export interface PieChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartProps {
  data: PieChartData[] | null;
  dataKey?: string;
  nameKey?: string;
  outerRadius?: number;
  label?: boolean;
  getCellColor?: (entry: PieChartData, index: number) => string;
  fills?: string[]; // Array of colors, one for each slice
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  formatter?: (value: number | string | undefined, name?: string) => React.ReactNode;
  labelFormatter?: (label: string) => React.ReactNode;
}

export function PieChart({
  data,
  dataKey = "value",
  nameKey = "name",
  outerRadius = 110,
  label = false,
  getCellColor,
  fills,
  width = "100%",
  height = "100%",
  formatter = (value) => String(value),
  labelFormatter,
}: PieChartProps) {
  // Check if all values are zero
  const allValuesZero = data && data.length > 0
    ? data.every((entry) => {
        const value = entry[dataKey];
        return value === null || value === undefined || Number(value) === 0;
      })
    : true;

  // Show empty state if data is null, empty, or all values are zero
  if (!data || data.length === 0 || allValuesZero) {
    return (
      <div style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}>
        <Empty className="w-full h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PieChartIcon />
            </EmptyMedia>
            <EmptyTitle>Nenhum dado disponível</EmptyTitle>
            <EmptyDescription>
              Não há dados para exibir no momento. Refaça sua busca ou entre em contato com o suporte.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  // Determine cell fill color
  const getCellFill = (entry: PieChartData, index: number): string => {
    // Priority 1: Use getCellColor function if provided
    if (getCellColor) {
      return getCellColor(entry, index);
    }
    
    // Priority 2: Use fills array if provided
    if (fills && fills[index] !== undefined) {
      return fills[index];
    }

    // Default fallback color
    return "#999999";
  };

  return (
    <ResponsiveContainer width={width as number | `${number}%`} height={height as number | `${number}%`}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          outerRadius={outerRadius}
          label={label}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.name}-${index}`}
              fill={getCellFill(entry, index)}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={formatter as ((value: any, name?: string) => React.ReactNode) | undefined}
          labelFormatter={labelFormatter}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}