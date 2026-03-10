'use client';

import * as React from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import { ShieldCheck, Server, Key, Terminal, UserSquare2 } from 'lucide-react';

export default function DashboardOverview() {
    const { user, fetchMe } = useAuth();

    React.useEffect(() => {
        if (!user) {
            fetchMe();
        }
    }, [user, fetchMe]);

    if (!user) {
        return (
            <div className="flex items-center justify-center p-12 h-[60vh]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Server className="w-8 h-8 text-muted-foreground opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                    <Terminal className="w-8 h-8 text-primary" />
                    System Overview
                </h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">
                    Identity Access Management Cockpit
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="col-span-1 lg:col-span-2 bg-card border border-border p-6 rounded-3xl shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <UserSquare2 className="w-48 h-48" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <UserSquare2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Identity Protocol</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Authenticated User</p>
                        </div>
                    </div>

                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">ID</span>
                            <span className="text-foreground">{user.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Username</span>
                            <span className="text-foreground">{user.username}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-muted-foreground">Email</span>
                            <span className="text-foreground">{user.email || 'N/A'}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="col-span-1 bg-card border border-border p-6 rounded-3xl shadow-lg"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <ShieldCheck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">Active Roles</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Assigned Clearance</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(user.roles || []).map((role: any) => {
                            const roleName = typeof role === 'object' ? role.name : role;
                            const roleKey = typeof role === 'object' ? (role.id || role.name) : role;
                            return (
                                <span key={roleKey} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-mono uppercase font-bold tracking-wider">
                                    {roleName}
                                </span>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-card border border-border p-6 rounded-3xl shadow-lg"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                        <Key className="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Cryptographic Permissions</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Granular Access Control</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(user.permissions || []).map((perm: any) => {
                        const permName = typeof perm === 'object' ? perm.name : perm;
                        const permKey = typeof perm === 'object' ? (perm.id || perm.name) : perm;
                        return (
                            <div key={permKey} className="flex items-center gap-2 bg-background border border-border rounded-xl p-3 font-mono text-xs uppercase text-foreground shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                {permName}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
