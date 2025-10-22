"use client";

import type { ReactNode } from "react";
import HeaderDashboard from "@/app/components/layout/headerMain";
import SidebarDashboard from "../components/layout/sidebarDashboard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <HeaderDashboard />
            <div className="flex flex-1">
                <SidebarDashboard />
                <main className="flex-1 max-w-7xl p-6 font-sans mt-18 ">{children}</main>
            </div>
        </div>
    );
}
