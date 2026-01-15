"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";

export interface BarChartData {
  name: string;
  [key: string]: string | number;
}

export type GradientType = "red" | "gray";

export interface BarChartProps {
  data: BarChartData[] | null;
  dataKey?: string;
  nameKey?: string;
  barName?: string;
  fills?: string[]; 
  gradientType?: GradientType;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  formatter?: (value: number | string | undefined, name?: string) => React.ReactNode;
  labelFormatter?: (label: string) => React.ReactNode;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = rgb1.r + (rgb2.r - rgb1.r) * factor;
  const g = rgb1.g + (rgb2.g - rgb1.g) * factor;
  const b = rgb1.b + (rgb2.b - rgb1.b) * factor;
  
  return rgbToHex(r, g, b);
}

function getGradientColors(gradientType: GradientType): { dark: string; light: string } {
  if (gradientType === "red") {
    return { dark: "#990000", light: "#EC4040" };
  }
  return { dark: "#1C1C1C", light: "#777777" };
}

export function BarChart({
  data,
  dataKey = "total",
  nameKey = "name",
  barName = "Total",
  fills,
  gradientType,
  width = "100%",
  height = "100%",
  formatter,
  labelFormatter,
  xAxisLabel,
  yAxisLabel,
}: BarChartProps) {
  const allValuesZero = data && data.length > 0 
    ? data.every((entry) => {
        const value = entry[dataKey];
        return value === null || value === undefined || Number(value) === 0;
      })
    : true;

  if (!data || data.length === 0 || allValuesZero) {
    return (
      <div style={{ width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }}>
        <Empty className="w-full h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 />
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

  const effectiveGradientType: GradientType | null = fills
    ? null 
    : gradientType ?? "red";

  const getBarFill = (index: number): string => {
    if (fills && fills[index] !== undefined) {
      return fills[index];
    }

    if (effectiveGradientType && data.length > 0) {
      const { dark, light } = getGradientColors(effectiveGradientType);
      const factor = data.length > 1 ? index / (data.length - 1) : 0;
      return interpolateColor(dark, light, factor);
    }

    return "#990000"; 
  };

  return (
    <ResponsiveContainer width={width as number | `${number}%`} height={height as number | `${number}%`}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={nameKey} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined} />
        <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
        <Tooltip
          formatter={formatter as ((value: any, name?: string) => React.ReactNode) | undefined}
          labelFormatter={labelFormatter}
        />
        <Bar
          dataKey={dataKey}
          name={barName}
          fill={undefined}
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarFill(index)} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
