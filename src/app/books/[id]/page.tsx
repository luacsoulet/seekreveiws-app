"use client"

import { useBook, useAddComment, useComments } from "@/utils/apiFunctions"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Star, Loader2, Eye, EyeOff, Heart, HeartOff, Send, MessageSquare } from "lucide-react"
import { useAuthStore } from "@/store/AuthStore"
import { CommentSection } from "@/component/CommentSection"

export default function BookPage() {
    const { id } = useParams()
    const { user, token, isAuthenticated } = useAuthStore()
    const { book, loading, error, getBook } = useBook(id as string)
    const { comments, loading: commentsLoading, error: commentsError, getComments } = useComments()

    const [newComment, setNewComment] = useState("")
    const [isRatingMode, setIsRatingMode] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [hoveredStar, setHoveredStar] = useState(0)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isSeen, setIsSeen] = useState(false)

    const { addComment, loading: addCommentLoading, error: addCommentError, fieldErrors } = useAddComment()

    useEffect(() => {
        getBook()
        getComments(false, true, id as string)
    }, [id])

    console.table(book)
    console.table(comments)
    const handleStarClick = (rating: number) => {
        if (isRatingMode) {
            setUserRating(rating)
            setIsRatingMode(false)
        }
    }

    const handleStarHover = (rating: number) => {
        if (isRatingMode) {
            setHoveredStar(rating)
        }
    }

    const toggleRatingMode = () => {
        if (userRating > 0) {
            setUserRating(0)
            setIsRatingMode(true)
            setHoveredStar(0)
        } else {
            setIsRatingMode(!isRatingMode)
            setHoveredStar(0)
        }
    }

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite)
        console.log(`Book ${isFavorite ? 'removed from' : 'added to'} favorites: ${book?.title}`)
    }

    const handleToggleSeen = () => {
        setIsSeen(!isSeen)
        console.log(`Book ${isSeen ? 'marked as not read' : 'marked as read'}: ${book?.title}`)
    }

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newComment.trim() && isAuthenticated) {
            try {
                await addComment(null, book?.id || null, user?.id || 0, newComment, token || "")
                getComments(false, true, id as string)
                setNewComment("")
            } catch (error) {
                console.error("Error submitting comment:", error)
            }
        }
    }

    const renderStars = () => {
        const stars = []
        const displayRating = hoveredStar || userRating

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: i * 0.05
                    }}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`text-2xl transition-colors duration-200 hover:scale-110 ${i <= displayRating ? 'text-yellow-400' : 'text-gray-400'
                        }`}
                >
                    <Star />
                </motion.button>
            )
        }
        return stars
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                when: "beforeChildren"
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-300 text-lg">Loading book...</p>
                </motion.div>
            </div>
        )
    }

    if (error || !book) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-500/20 backdrop-blur-sm p-6 rounded-lg"
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Error loading book</h2>
                    <p className="text-gray-200">Impossible to load the book.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center min-h-screen p-8 mt-40"
        >
            <div className="flex gap-8 max-w-6xl w-full items-center">
                <motion.div
                    variants={itemVariants}
                    className="flex-shrink-0 w-80 h-[480px] relative rounded-lg overflow-hidden"
                >
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm">
                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                        </div>
                    )}
                    <Image
                        src={book.cover_image || ""}
                        alt={book.title || ""}
                        fill
                        className={`object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoadingComplete={() => setImageLoaded(true)}
                    />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="flex-1 bg-gray-200/10 backdrop-blur-sm rounded-lg p-8 relative"
                >
                    <div className="absolute top-4 right-4 flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleToggleSeen}
                            className={`p-2 rounded-full transition-colors duration-300 ${isSeen ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700/30 text-gray-400'
                                }`}
                            title={isSeen ? "Mark as not read" : "Mark as read"}
                        >
                            {isSeen ? <Eye size={20} /> : <EyeOff size={20} />}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleToggleFavorite}
                            className={`p-2 rounded-full transition-colors duration-300 ${isFavorite ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/30 text-gray-400'
                                }`}
                            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {isFavorite ? <Heart size={20} /> : <HeartOff size={20} />}
                        </motion.button>
                    </div>

                    <div className="flex flex-col gap-8">
                        <motion.div variants={itemVariants}>
                            <h1 className="text-5xl font-bold text-white mb-2">{book.title}</h1>
                            <p className="text-gray-300 text-lg">Written by <span className="text-white font-medium">{book.author}</span></p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-col gap-4">
                            <div className="flex items-center gap-6">
                                <span className="text-gray-300 text-lg">
                                    <span className="text-white font-semibold">{book.genre}</span>
                                </span>
                                <span className="text-gray-300 text-lg">|</span>
                                <span className="text-gray-300 text-lg">
                                    <span className="text-white font-semibold">
                                        {book.publish_date ? new Date(book.publish_date).getFullYear() : "N/A"}
                                    </span>
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-gray-300 text-lg">Average rating:</span>
                                <span className="text-yellow-400 text-xl font-semibold flex items-center gap-2">
                                    <Star /> {book.avg_rating?.toFixed(1)}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="border-t border-gray-500/20 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {userRating > 0 ? `Your note: ${userRating}/5` : 'Your note'}
                                </h3>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={toggleRatingMode}
                                    className={`px-4 py-2 ${isRatingMode ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors duration-200 text-sm font-medium`}
                                >
                                    {isRatingMode ? 'Cancel' : userRating > 0 ? 'Modify the note' : 'Add a note'}
                                </motion.button>
                            </div>

                            <AnimatePresence>
                                {isRatingMode && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                            opacity: { duration: 0.2 }
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 py-4">
                                            {renderStars()}
                                            <span className="ml-4 text-gray-400 text-sm">
                                                Click on a star to rate
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {userRating > 0 && !isRatingMode && (
                                <div className="flex items-center gap-2 py-2">
                                    {[...Array(5)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: i * 0.05
                                            }}
                                            className={`text-2xl ${i < userRating ? 'text-yellow-400' : 'text-gray-400'}`}
                                        >
                                            <Star />
                                        </motion.span>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <motion.div variants={itemVariants} className="border-t border-gray-500/20 pt-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Synopsis</h3>
                            <p className="text-gray-200 text-lg leading-relaxed">
                                {book.description}
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <CommentSection
                comments={comments || []}
                commentsLoading={commentsLoading}
                commentsError={commentsError || ""}
                handleSubmitComment={handleSubmitComment}
                newComment={newComment}
                setNewComment={setNewComment}
                isAuthenticated={isAuthenticated}
                itemVariants={itemVariants}
                addCommentLoading={addCommentLoading}
                addCommentError={addCommentError}
                fieldErrors={fieldErrors}
            />
        </motion.div>
    )
}