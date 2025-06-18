"use client"

import { MovieCard } from "@/component/MovieCard"
import { useMovies } from "@/utils/apiFunctions"
import { useEffect } from "react"

export default function MoviesPage() {
    const { movies, loading, error, getMovies } = useMovies(20)

    useEffect(() => {
        getMovies()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center mt-50 gap-4 p-4">
            <div className="w-full max-w-7xl">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Movies</h1>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 bg-red-100/10 p-4 rounded-lg text-center">
                        Error loading movies: {error}
                    </div>
                )}

                {!loading && movies && movies.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : !loading && (
                    <p className="text-center text-gray-400">No movies found</p>
                )}
            </div>
        </div>
    )
}