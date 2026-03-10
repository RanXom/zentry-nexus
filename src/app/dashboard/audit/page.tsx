'use client';

import * as React from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { Database, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface AuditLog {
    id: string;
    action: string;
    userId: string;
    timestamp: string;
    status: 'SUCCESS' | 'REVOKED' | 'FAILED' | 'LOGIN_SUCCESS' | 'WARNING';
    details: string;
}

export default function AuditLedgerPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [logs, setLogs] = React.useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchLogs = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get('/audit/logs');
            setLogs(res.data || []);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Failed to retrieve forensic ledger');
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        const isAdmin = user?.roles?.some((role: any) => {
            const roleName = typeof role === 'object' ? role.name : role;
            return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
        });

        if (user && !isAdmin) {
            router.replace('/dashboard');
            return;
        }

        fetchLogs();
    }, [user, router, fetchLogs]);

    const getStatusBadge = (status: AuditLog['status']) => {
        switch (status) {
            case 'SUCCESS':
            case 'LOGIN_SUCCESS':
                return <span className="px-2 py-1 bg-success/10 text-success border border-success/20 rounded font-mono text-xs uppercase font-bold">SUCCESS</span>;
            case 'REVOKED':
            case 'FAILED':
                return <span className="px-2 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded font-mono text-xs uppercase font-bold">REVOKED</span>;
            case 'WARNING':
                return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono text-xs uppercase font-bold">WARNING</span>;
            default:
                return <span className="px-2 py-1 bg-muted/20 text-muted-foreground border border-border rounded font-mono text-xs uppercase font-bold">{status}</span>;
        }
    };

    const isAdmin = user?.roles?.some((role: any) => {
        const roleName = typeof role === 'object' ? role.name : role;
        return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
    });

    if (!user || !isAdmin) {
        return null; // or a calculating state before redirect
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <header className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
                        <Database className="w-8 h-8 text-primary" />
                        Audit Ledger
                    </h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-mono">
                        Forensic System Events
                    </p>
                </header>

                <button
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Refresh Ledger
                </button>
            </div>

            {error ? (
                <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-4 text-destructive">
                    <AlertCircle className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold font-mono uppercase tracking-wider">Access Denied / Error</h3>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-mono border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium tracking-wider">Timestamps (UTC)</th>
                                    <th className="px-6 py-4 font-medium tracking-wider">Event ID</th>
                                    <th className="px-6 py-4 font-medium tracking-wider">Action</th>
                                    <th className="px-6 py-4 font-medium tracking-wider">Identity</th>
                                    <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {logs.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono">
                                            NO RECORDS FOUND IN FORENSIC LEDGER
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-muted/10 transition-colors font-mono text-xs">
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap opacity-70">
                                                {log.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-foreground">
                                                {log.action}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-primary">
                                                {log.userId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(log.status)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
