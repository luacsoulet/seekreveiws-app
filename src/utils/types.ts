export interface Movie {
    id: number
    title: string
    description: string
    director: string
    genre: string
    cover_image: string
    avg_rating: number
    release_date: string,
    created_at: string,
}
export interface Book {
    id: number
    title: string
    description: string
    author: string
    genre: string
    cover_image: string
    avg_rating: number
    publish_date: string,
    created_at: string,
}

export interface Comment {
    id: number
    message: string
    user_id: number
    created_at: string
    book_id?: number
    movie_id?: number
}