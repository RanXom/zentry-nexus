'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';

const loginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, error } = useAuth();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data);
            router.push('/dashboard');
        } catch (e) {
            // Error is handled in the store
        }
    };

    return (
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements to enforce the "High-Security Terminal / Apple Pro" feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-4 shadow-xl"
                    >
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">The Nexus</h1>
                    <p className="text-sm text-muted-foreground mt-2 uppercase tracking-widest font-mono">
                        Secure Authentication Gateway
                    </p>
                </div>

                <motion.div
                    className="bg-card border border-border rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
                >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2 overflow-hidden"
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Identity</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        {...form.register('username')}
                                        type="text"
                                        autoComplete="username"
                                        className="w-full h-12 bg-background border border-border rounded-xl px-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
                                        placeholder="Enter ID"
                                        disabled={isLoading}
                                    />
                                </div>
                                {form.formState.errors.username && (
                                    <p className="text-xs text-destructive ml-1">
                                        {form.formState.errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground ml-1">Passcode</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        {...form.register('password')}
                                        type="password"
                                        autoComplete="current-password"
                                        className="w-full h-12 bg-background border border-border rounded-xl px-10 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-xs text-destructive ml-1">
                                        {form.formState.errors.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Verifying...</span>
                                </motion.div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Initialize Session
                                    <motion.span
                                        className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"
                                    >
                                        →
                                    </motion.span>
                                </span>
                            )}
                        </button>
                    </form>
                </motion.div>

                <div className="mt-8 text-center text-xs text-muted-foreground font-mono opacity-50">
                    <p>ZENTRY NEXUS v1.0.0</p>
                    <p>UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED</p>
                </div>
            </motion.div>
        </div>
    );
}
