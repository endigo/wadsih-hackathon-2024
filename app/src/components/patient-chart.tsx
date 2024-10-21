"use client";

import * as React from "react";
import { Bar, Line, CartesianGrid, XAxis, ComposedChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Page Views",
  },
  admitted: {
    label: "Admitted",
    color: "hsl(var(--chart-1))",
  },
  departed: {
    label: "Departed",
    color: "hsl(var(--chart-2))",
  },
  waiting: {
    label: "Waiting time",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PatientChart({
  currentDate,
  currentHospital,
}: {
  currentDate: string;
  currentHospital: string;
}) {
  const [chartData, setData] = React.useState([]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    params.append("time", currentDate);
    params.append("hospital", currentHospital);
    fetch("/api/patients/traffic?" + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
      });
  }, [currentDate, currentHospital]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Patient Traffic</CardTitle>
          <CardDescription>
            Showing patient traffic for the last 30 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="admitted" fill={`var(--color-admitted)`} />
            <Bar dataKey="discharged" fill={`var(--color-departed)`} />
            <Line
              dataKey={"waiting"}
              type="natural"
              // stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
