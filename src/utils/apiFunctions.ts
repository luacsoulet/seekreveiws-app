import { useState } from 'react'
import { useAuthStore, User } from '@/store/AuthStore'
import { Book, Comment, Movie } from './types'

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

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching movies')
            }

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

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching movies')
            }

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

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching comments')
            }

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

            if (!response.ok) {
                throw new Error(data.message || 'Error while fetching comments')
            }

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

    const addComment = async (movieId: number | null, bookId: number | null, userId: number, message: string, token: string) => {
        setLoading(true)
        setError(null)

        try {
            if (!token) {
                setError("Authentication token is missing");
                setLoading(false);
                return;
            }

            if (!userId) {
                setError("User ID is missing");
                setLoading(false);
                return;
            }

            if (!message.trim()) {
                setError("Comment message cannot be empty");
                setLoading(false);
                return;
            }

            if (!bookId && !movieId) {
                setError("Either book ID or movie ID must be provided");
                setLoading(false);
                return;
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

    return { addComment, loading, error }
}