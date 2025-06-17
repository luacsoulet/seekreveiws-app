import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
    id: number
    username: string
    email: string
    is_admin: boolean
    description?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (user: User, token: string) => void
    loginWithToken: (token: string) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
    setToken: (token: string) => void
    isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user: User, token: string) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                })
            },
            loginWithToken: (token: string) => {
                const user = decodeJWT(token)
                if (user) {
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    })
                }
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                })
            },
            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user
                if (currentUser) {
                    set({
                        user: { ...currentUser, ...userData },
                    })
                }
            },
            setToken: (token: string) => {
                set({ token })
            },
            isAdmin: () => {
                const currentUser = get().user
                return currentUser?.is_admin ?? false
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
) 