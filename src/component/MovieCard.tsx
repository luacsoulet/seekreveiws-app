import { Movie } from "@/utils/types"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"

export const MovieCard = ({ movie }: { movie: Movie }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <a
            className="group relative w-64 h-96 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Image
                src={movie.cover_image}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gray-500/10 backdrop-blur-sm rounded-t-xl p-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold drop-shadow-lg line-clamp-2">
                        {movie.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm font-semibold">
                            ⭐ {movie.avg_rating.toFixed(1)}
                        </span>
                        <span className="text-white/70 text-sm">
                            {movie.genre}
                        </span>
                    </div>
                </div>

                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isHovered ? "auto" : 0,
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { duration: 0.3, delay: isHovered ? 0.1 : 0 }
                    }}
                    className="overflow-hidden"
                >
                    <div className="pt-4">
                        <p className="text-white/90 text-sm leading-relaxed mb-3">
                            {movie.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-white/70">
                            <span>Directed by {movie.director}</span>
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </a>
    )
}