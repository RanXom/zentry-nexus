'use client';

import * as React from 'react';
import { useAuth } from '@/store/useAuth';
import { motion } from 'framer-motion';
import { ShieldCheck, Server, Key, Terminal, UserSquare2, Search, Users, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function DashboardOverview() {
    const { user, fetchMe } = useAuth();
    const [usersList, setUsersList] = React.useState<any[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);

    const isAdmin = React.useMemo(() => {
        return user?.roles?.some((role: any) => {
            const roleName = typeof role === 'object' ? role.name : role;
            return roleName === 'ADMIN' || roleName === 'ROLE_ADMIN';
        });
    }, [user]);

    React.useEffect(() => {
        if (!user) {
            fetchMe();
        }
    }, [user, fetchMe]);
    const fetchUsersList = React.useCallback(async () => {
        setIsLoadingUsers(true);
        try {
            const res = await apiClient.get('/admin/users');
            setUsersList(res.data || []);
        } catch (e) {
            console.error('Failed to fetch users', e);
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    React.useEffect(() => {
        if (isAdmin) {
            fetchUsersList();
        }
    }, [isAdmin, fetchUsersList]);

    const handleToggleLock = async (userId: string, currentStatus: boolean) => {
        try {
            await apiClient.patch(`/admin/users/${userId}/toggle-lock`);
            // Optimistically update the UI instead of re-fetching everything
            setUsersList(prev => prev.map(u =>
                u.id === userId ? { ...u, accountLocked: !currentStatus } : u
            ));
        } catch (e: any) {
            alert(e.message || 'Failed to toggle lock status. You may be rate limited.');
        }
    };

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

    const filteredUsers = usersList.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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

            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-card border border-border p-6 rounded-3xl shadow-lg"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground">Registered Users</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">System Directory</p>
                            </div>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 bg-background border border-border rounded-xl pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-border bg-background">
                        {isLoadingUsers ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-muted/30 text-muted-foreground font-mono border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 font-medium tracking-wider">ID</th>
                                        <th className="px-6 py-4 font-medium tracking-wider">Username</th>
                                        <th className="px-6 py-4 font-medium tracking-wider">Email</th>
                                        <th className="px-6 py-4 font-medium tracking-wider">Roles</th>
                                        <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-mono">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-muted/10 transition-colors font-mono text-xs">
                                                <td className="px-6 py-4 whitespace-nowrap opacity-70">
                                                    {u.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-foreground">
                                                    {u.username}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                    {u.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {(u.roles || []).map((r: any) => {
                                                            const rName = typeof r === 'object' ? r.name : r;
                                                            return (
                                                                <span key={rName} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded font-bold uppercase text-[10px]">
                                                                    {rName.replace('ROLE_', '')}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {u.active ? (
                                                        <span className="px-2 py-1 bg-success/10 text-success border border-success/20 rounded font-mono text-[10px] uppercase font-bold">Active</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded font-mono text-[10px] uppercase font-bold">Inactive</span>
                                                    )}
                                                    {u.accountLocked && (
                                                        <span className="ml-2 px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded font-mono text-[10px] uppercase font-bold">Locked</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleToggleLock(u.id, u.accountLocked)}
                                                        className={`px-3 py-1.5 rounded font-mono text-xs uppercase font-bold transition-all border ${u.accountLocked
                                                            ? 'bg-success/10 text-success border-success/30 hover:bg-success/20'
                                                            : 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20'
                                                            }`}
                                                    >
                                                        {u.accountLocked ? 'Unlock' : 'Lock'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
