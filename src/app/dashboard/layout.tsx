import * as React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-auto relative p-8">
                {/* Subtle grid pattern for authentic Apple-inspired terminal feel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                <div className="relative z-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
