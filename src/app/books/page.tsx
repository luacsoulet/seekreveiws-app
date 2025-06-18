"use client"

import { BookCard } from "@/component/BookCard"
import { MovieCard } from "@/component/MovieCard"
import { useBooks } from "@/utils/apiFunctions"
import { useEffect } from "react"

export default function BooksPage() {
    const { books, loading, error, getBooks } = useBooks(20)

    useEffect(() => {
        getBooks()
    }, [])
    return (
        <div className="flex flex-col items-center justify-center mt-50 gap-4 p-4">
            <div className="w-full max-w-7xl">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Books</h1>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 bg-red-100/10 p-4 rounded-lg text-center">
                        Error loading books: {error}
                    </div>
                )}

                {!loading && books && books.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : !loading && (
                    <p className="text-center text-gray-400">No books found</p>
                )}
            </div>
        </div>
    )
}