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
    is_seen?: boolean
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
    is_seen?: boolean
    seen_id?: number
}

export interface Comment {
    id: number
    message: string
    user_id: number
    created_at: string
    book_id?: number
    movie_id?: number
}

export interface Favorites {
    favorite_id: number
    favorite_at: string
    created_at: string
    book_id?: number
    book_title?: string
    book_cover?: string
    movie_id?: number
    movie_title?: string
    movie_cover?: string
}
export interface Seen {
    seen_id: number
    seen_at: string
    book_id?: number
    book_title?: string
    book_cover?: string
    movie_id?: number
    movie_title?: string
    movie_cover?: string
}