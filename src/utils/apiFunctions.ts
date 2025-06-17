import { useState } from 'react'
import { useAuthStore, User } from '@/store/AuthStore'
import { Book, Movie } from './types'

export function useLogin() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { login: loginStore } = useAuthStore()

    const login = async (email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching books')
            }

            loginStore(data.user, data.token)
            return data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching books'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { login, error, loading }
}

export function useRegister() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const { login } = useAuthStore()

    const register = async (username: string, email: string, password: string) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching books')
            }

            setUser(data.user)

            const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const loginData = await loginResponse.json()

            if (loginResponse.ok) {
                login(loginData.user, loginData.token)
            }

            return data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching books'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { register, error, loading, user }
}

export function useMovies() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getMovies = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching movies')
            }

            setMovies(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching movies'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { movies, loading, error, getMovies }
}
export function useBooks() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getBooks = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching books')
            }

            setBooks(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching books'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { books, loading, error, getBooks }
}