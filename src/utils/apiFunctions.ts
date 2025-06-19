import { useState } from 'react'
import { useAuthStore, User } from '@/store/AuthStore'
import { Book, Comment, Movie } from './types'


export const handleApiError = (type: string, response: Response) => {
    if (!response.ok) {
        const errorMessages: Record<number, string> = {
            400: "Bad request",
            401: "Invalid credentials",
            403: "Forbidden access",
            404: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
            500: "Internal server error"
        }
        const message = errorMessages[response.status] || `Error while fetching ${type}`
        throw new Error(message)
    }
}

export function useLogin() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [authError, setAuthError] = useState<string | null>(null)

    const { login: loginStore } = useAuthStore()

    const errorMessages: Record<string, string> = {
        "!email": "Email is required",
        "!password": "Password is required",
    }

    const validateFields = (email: string, password: string) => {
        const errors: Record<string, string> = {}
        if (!email) errors.email = errorMessages["!email"]
        if (!password) errors.password = errorMessages["!password"]
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const login = async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        setAuthError(null)

        try {
            const isValid = validateFields(email, password)

            if (!isValid) {
                setLoading(false)
                setError("Please check the form fields")
                return null
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 401) {
                    setAuthError("Invalid credentials. Please check your email and password.")
                    setLoading(false)
                    return null
                }
                handleApiError("user", response)
            }

            loginStore(data.user, data.token)
            return data
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching user'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { login, error, loading, fieldErrors, authError }
}

export function useRegister() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [authError, setAuthError] = useState<string | null>(null)

    const { login } = useAuthStore()

    const errorMessages: Record<string, string> = {
        "!username": "Username is required",
        "!email": "Email is required",
        "!password": "Password is required"
    }

    const validateFields = (username: string, email: string, password: string) => {
        const errors: Record<string, string> = {}
        if (!username) errors.username = errorMessages["!username"]
        if (!email) errors.email = errorMessages["!email"]
        if (!password) errors.password = errorMessages["!password"]
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const register = async (username: string, email: string, password: string) => {
        setLoading(true)
        setError(null)
        setAuthError(null)

        try {
            const isValid = validateFields(username, email, password)

            if (!isValid) {
                setLoading(false)
                setError("Please check the form fields")
                return null
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 409) {
                    setAuthError("This email is already in use. Please choose a different one.")
                    setLoading(false)
                    return null
                }
                throw new Error(data.message || 'Error while fetching user')
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
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching user'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { register, error, loading, user, fieldErrors, authError }
}

export function useMovies(limit: number = 20) {
    const [movies, setMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getMovies = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?limit=${limit}`)
            const data = await response.json()

            handleApiError("movies", response)

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

export function useBooks(limit: number = 20) {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getBooks = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?limit=${limit}`)

            const data = await response.json()

            handleApiError("books", response)

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

export function useBook(id: string) {
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getBook = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`)
            const data = await response.json()

            handleApiError("book", response)

            setBook(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching movies'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { book, loading, error, getBook }
}

export function useMovie(id: string) {
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getMovie = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`)
            const data = await response.json()

            handleApiError("movie", response)

            setMovie(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching movies'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { movie, loading, error, getMovie }
}

export const useMovieComments = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getMovieComments = async (id: string) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/movie?${id}`)
            const data = await response.json()

            handleApiError("comments", response)

            setComments(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching comments'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { comments, loading, error, getMovieComments }
}

export const useComments = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getComments = async (movie: boolean, book: boolean, id: string) => {
        setLoading(true)
        setError(null)

        try {
            const endpoint = movie ? "movie" : "book";
            const paramName = movie ? "movie_id" : "book_id";
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${endpoint}?${paramName}=${id}`)
            const data = await response.json()

            handleApiError("comments", response)

            setComments(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching comments'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { comments, loading, error, getComments }
}

export const useAddComment = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const errorMessages: Record<string, string> = {
        "!token": "Authentication token is missing",
        "!userId": "User ID is missing",
        "!message.trim()": "Comment message cannot be empty",
        "!bookId && !movieId": "Either book ID or movie ID must be provided"
    }

    const validateFields = (movieId: number | null, bookId: number | null, userId: number, message: string, token: string) => {
        const errors: Record<string, string> = {}

        if (!token) errors.token = errorMessages["!token"]
        if (!userId) errors.userId = errorMessages["!userId"]
        if (!message.trim()) errors.message = errorMessages["!message.trim()"]
        if (!bookId && !movieId) errors.id = errorMessages["!bookId && !movieId"]

        setFieldErrors(errors)

        return Object.keys(errors).length === 0
    }

    const addComment = async (movieId: number | null, bookId: number | null, userId: number, message: string, token: string) => {
        setLoading(true)
        setError(null)
        setFieldErrors({})

        try {
            const isValid = validateFields(movieId, bookId, userId, message, token)

            if (!isValid) {
                setLoading(false)
                setError("Please check the form fields")
                return null
            }

            const url = `${process.env.NEXT_PUBLIC_API_URL}/comments`;
            let body;

            if (bookId) {
                body = { book_id: bookId, user_id: userId, message: message };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error while adding comment');
                }

                return data;
            } else if (movieId) {
                body = { movie_id: movieId, user_id: userId, message: message };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error while adding comment');
                }

                return data;
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while adding comment'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { addComment, loading, error, fieldErrors }
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getUser = async (id: string) => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)
            const data = await response.json()

            handleApiError("user", response)

            setUser(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error while fetching user'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { user, loading, error, getUser }
}