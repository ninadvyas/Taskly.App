import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Progress page loading state
export default function ProgressLoading() {
    return (
        <div className="h-screen flex flex-col px-80 overflow-hidden">
            {/* Navbar skeleton */}
            <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-12">
                    <Skeleton className="h-9 w-28 rounded-sm" />
                    <div className="flex gap-6">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-40 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-12" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-3 gap-4 h-[240px]">
                    <div className="col-span-2 border rounded-lg p-4 space-y-3">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-[170px] w-full rounded-md" />
                    </div>
                    <div className="border rounded-lg p-4 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-[170px] w-full rounded-md" />
                    </div>
                </div>

                {/* Recent tasks table */}
                <div className="border rounded-lg p-4 space-y-4">
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-8 items-center">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-14" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
