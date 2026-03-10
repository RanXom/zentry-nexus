import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api-client';

export interface User {
    id: string;
    username: string;
    email?: string;
    roles: string[];
    permissions: string[];
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (credentials: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>;
    fetchMe: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    // The endpoint accepts username and password
                    const response = await apiClient.post('/auth/login', credentials);
                    const { accessToken, refreshToken } = response.data;

                    Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict', expires: 7 }); // 7 days

                    set({ accessToken, isAuthenticated: true, error: null });

                    await get().fetchMe();

                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Failed to login',
                        isAuthenticated: false
                    });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                try {
                    await apiClient.post('/auth/logout');
                } catch (error) {
                    console.error('Logout failed on the backend:', error);
                } finally {
                    Cookies.remove('refreshToken');
                    set({ user: null, accessToken: null, isAuthenticated: false, error: null });
                }
            },

            refreshToken: async () => {
                const token = Cookies.get('refreshToken');
                if (!token) {
                    get().logout();
                    return null;
                }

                try {
                    const response = await apiClient.post('/auth/refresh', { refreshToken: token });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    if (newRefreshToken) {
                        Cookies.set('refreshToken', newRefreshToken, { secure: true, sameSite: 'strict', expires: 7 });
                    }

                    set({ accessToken, isAuthenticated: true });

                    if (!get().user) {
                        await get().fetchMe();
                    }

                    return accessToken;
                } catch (error) {
                    get().logout();
                    return null;
                }
            },

            fetchMe: async () => {
                try {
                    const response = await apiClient.get('/users/me');
                    set({ user: response.data, isAuthenticated: true });
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    if (get().accessToken) {
                        // Let the interceptor handle the refresh process
                    }
                }
            },
        }),
        {
            name: 'zentry-auth-storage',
            storage: createJSONStorage(() => localStorage),
            // We only persist the essential data to display immediately on reload. 
            // The refresh token is in cookies securely. 
            // accessToken shouldn't ideally be in localStorage, but since it's a short-lived stateless JWT,
            // it is acceptable for basic persistence, although keeping it only in memory is safer.
            // For this high security terminal, let's keep it in memory & use refresh token on mount.
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
