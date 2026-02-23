"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";

type Props = {
  data: { status: string; count: number; fill: string }[];
};

const STATUS_STYLES: Record<string, { stroke: string; fill: string }> = {
  starting: { stroke: "#ef4444", fill: "rgba(239,68,68,0.15)" },
  progress: { stroke: "#f97316", fill: "rgba(249,115,22,0.15)" },
  done: { stroke: "#22c55e", fill: "rgba(34,197,94,0.15)" },
};

const config: ChartConfig = {
  starting: { label: "Starting" },
  progress: { label: "In Progress" },
  done: { label: "Done" },
};

export default function Charts(props: Props) {
  const { data } = props;
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex items-center pb-0">
        <CardTitle className="text-base">Status Breakdown</CardTitle>
        <CardDescription>Your task statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                config[value as keyof typeof config]?.label as string
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} strokeWidth={1.5}>
              {data.map((entry) => {
                const style = STATUS_STYLES[entry.status] ?? {
                  stroke: "#888",
                  fill: "rgba(136,136,136,0.15)",
                };
                return (
                  <Cell
                    key={entry.status}
                    fill={style.fill}
                    stroke={style.stroke}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
