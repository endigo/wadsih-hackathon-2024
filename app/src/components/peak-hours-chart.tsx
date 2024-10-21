"use client";

import * as React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, BarProps } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description =
  "An interactive bar chart with color-coded green bars";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(142, 76%, 36%)", // A medium green color
  },
} satisfies ChartConfig;

const hourFormatter = (value: number) => {
  if (value === 0) return "12 AM";
  if (value === 12) return "12 PM";
  if (value > 12) return `${value - 12} PM`;
  return `${value} AM`;
};

const getBarColor = (count: number, maxCount: number) => {
  // Calculate the intensity based on the count relative to the maximum
  const intensity = Math.round((count / maxCount) * 100);
  // Use HSL to create a range of reds
  return `hsl(0, 100%, ${Math.max(20, 80 - intensity)}%)`;
};
export function PeakHoursChart({
  chartData,
  className,
}: {
  chartData: { hour: number; count: number }[];
  className?: string;
}) {
  const maxCount = Math.max(...chartData.map((item) => item.count));

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Peak Hours</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={hourFormatter}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={hourFormatter}
                />
              }
            />
            <Bar
              dataKey="count"
              fill={chartConfig.count.color}
              shape={(props: BarProps) => {
                const { x, y, width, height } = props;
                const count = (props as any).payload.count as number;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={getBarColor(count, maxCount)}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
