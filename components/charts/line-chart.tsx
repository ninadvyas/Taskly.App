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
import {
    Line,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

type Props = {
    data: { date: string; count: number }[];
};

const config: ChartConfig = {
    count: {
        label: "Tasks Created",
        color: "hsl(var(--chart-1))",
    },
};

export default function LineChartComp({ data }: Props) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Tasks Created</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <ChartContainer config={config} className="h-full w-full min-h-[180px]">
                    <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 11 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tickMargin={4}
                            tick={{ fontSize: 11 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "var(--color-count)" }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
