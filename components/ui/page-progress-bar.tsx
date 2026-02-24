"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Thin animated progress bar at the top of the viewport.
 * Triggers whenever the route changes (pathname changes).
 */
export default function PageProgressBar() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Start bar on route change
        setVisible(true);
        setWidth(0);

        // Animate quickly to ~85% then stop (indeterminate phase)
        let w = 0;
        timerRef.current = setInterval(() => {
            w += Math.random() * 12 + 5;
            if (w > 85) {
                w = 85;
                if (timerRef.current) clearInterval(timerRef.current);
            }
            setWidth(w);
        }, 120);

        // Complete the bar a tick later
        const completeTimer = setTimeout(() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setWidth(100);
            setTimeout(() => {
                setVisible(false);
                setWidth(0);
            }, 300);
        }, 600);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            clearTimeout(completeTimer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    if (!visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "2px",
                width: `${width}%`,
                background: "hsl(var(--primary))",
                transition: "width 0.12s ease, opacity 0.3s ease",
                zIndex: 9999,
                opacity: visible ? 1 : 0,
                borderRadius: "0 2px 2px 0",
                boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
            }}
        />
    );
}
