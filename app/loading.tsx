import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Root page (task dashboard) loading state shown by Next.js App Router
export default function Loading() {
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

            {/* Main content skeleton */}
            <div className="flex-1 flex flex-col border rounded-sm overflow-hidden">
                {/* Form area */}
                <div className="p-6 space-y-4 border-b">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-52" />
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-9 w-48 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                        <Skeleton className="h-9 w-32 rounded-md" />
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                    <Skeleton className="h-16 w-full rounded-md" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                </div>
                {/* Table area */}
                <div className="p-6 space-y-3">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-44" />
                    <div className="space-y-2 pt-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-6 items-center">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
