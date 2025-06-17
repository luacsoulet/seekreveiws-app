"use client"
import { useBooks, useMovies } from "@/utils/apiFunctions";
import { useEffect } from "react";
import { MovieCard } from "@/component/MovieCard";
import { BookCard } from "@/component/BookCard";

export default function Home() {
  const { movies, loading: moviesLoading, error: moviesError, getMovies } = useMovies()
  const { books, loading: booksLoading, error: booksError, getBooks } = useBooks()

  useEffect(() => {
    getMovies()
    getBooks()
  }, [])

  console.table(movies)
  console.table(books)

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full mt-[20vh]">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Movies</h2>
        {moviesLoading && <p>Loading...</p>}
        {moviesError && <p>Error: {moviesError}</p>}
        {movies.length > 0 && (
          <>
            <div className="flex gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {booksLoading && <p>Loading...</p>}
        {booksError && <p>Error: {booksError}</p>}
        <h2 className="text-2xl font-bold">Books</h2>
        {books.length > 0 && (
          <>
            <div className="flex gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
