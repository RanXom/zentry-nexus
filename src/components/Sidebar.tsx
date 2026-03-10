'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, LayoutDashboard, Database, LogOut, TerminalSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/store/useAuth';

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isAdmin = user?.roles?.some((role: any) => {
        const roleName = typeof role === 'object' ? role.name : role;
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
    });

    const navItems = [
        {
            name: 'System Overview',
            href: '/dashboard',
            icon: LayoutDashboard,
            requiresAdmin: false,
        },
        {
            name: 'Audit Ledger',
            href: '/dashboard/audit',
            icon: Database,
            requiresAdmin: true,
        },
    ];

    return (
        <div className="w-64 h-screen bg-card border-r border-border flex flex-col pt-6 pb-4 px-4 shadow-2xl relative z-20">
            <div className="flex items-center gap-3 px-2 mb-10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">Nexus</h2>
                    <p className="text-xs text-muted-foreground font-mono uppercase">Cockpit</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => {
                    if (item.requiresAdmin && !isAdmin) return null;

                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 relative z-10" />
                                <span className="text-sm font-medium relative z-10">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto space-y-4">
                {user && (
                    <div className="px-3 py-4 bg-background rounded-xl border border-border flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                            <TerminalSquare className="w-4 h-4" />
                            <span>{user.username}</span>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-1.5 mt-2">
                                <ShieldAlert className="w-3.5 h-3.5 text-destructive" />
                                <span className="text-[10px] uppercase font-bold text-destructive tracking-widest">SysAdmin</span>
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors rounded-xl hover:bg-destructive/10"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    );
}
