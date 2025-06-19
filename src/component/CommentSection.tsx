import { motion, Variants } from "framer-motion"
import { MessageSquare, Send, Loader2, AlertCircle } from "lucide-react"
import { Comment } from "@/component/Comment"
import { Comment as CommentType } from "@/utils/types"

export type CommentSectionProps = {
    comments: CommentType[],
    commentsLoading: boolean,
    commentsError: string,
    handleSubmitComment: (e: React.FormEvent) => void,
    newComment: string,
    setNewComment: (value: string) => void,
    isAuthenticated: boolean,
    itemVariants: Variants,
    addCommentLoading?: boolean,
    addCommentError?: string | null,
    fieldErrors?: Record<string, string>
}

export const CommentSection = ({
    comments,
    commentsLoading,
    commentsError,
    handleSubmitComment,
    newComment,
    setNewComment,
    isAuthenticated,
    itemVariants,
    addCommentLoading = false,
    addCommentError = null,
    fieldErrors = {}
}: CommentSectionProps) => {
    return (
        <motion.div
            variants={itemVariants}
            className="w-full max-w-6xl mt-12 bg-gray-200/10 backdrop-blur-sm rounded-lg p-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Comments</h2>
            </div>

            {isAuthenticated && (
                <>
                    <form onSubmit={handleSubmitComment} className="mb-8">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 flex flex-col">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                    className={`w-full bg-gray-800/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ${fieldErrors.message ? 'border border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                                    autoComplete="on"
                                    disabled={addCommentLoading}
                                />
                                {fieldErrors.message && (
                                    <span className="text-red-400 text-sm mt-1 flex items-center">
                                        <AlertCircle size={14} className="mr-1" /> {fieldErrors.message}
                                    </span>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-colors duration-200 ${(!newComment.trim() || addCommentLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!newComment.trim() || addCommentLoading}
                            >
                                {addCommentLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send</span>
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {addCommentError && (
                            <div className="mt-3 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm flex items-center">
                                <AlertCircle size={16} className="mr-2" />
                                <span>{addCommentError}</span>
                            </div>
                        )}

                        {(fieldErrors.token || fieldErrors.userId || fieldErrors.id) && (
                            <div className="mt-3 p-3 bg-amber-500/20 text-amber-300 rounded-lg text-sm">
                                <div className="flex items-center mb-1">
                                    <AlertCircle size={16} className="mr-2" />
                                    <span className="font-medium">Attention requise</span>
                                </div>
                                <ul className="list-disc ml-6 space-y-1">
                                    {fieldErrors.token && <li>{fieldErrors.token}</li>}
                                    {fieldErrors.userId && <li>{fieldErrors.userId}</li>}
                                    {fieldErrors.id && <li>{fieldErrors.id}</li>}
                                </ul>
                            </div>
                        )}
                    </form>
                </>
            )}

            <div className="space-y-4">
                {commentsLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                ) : commentsError ? (
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center">
                        <AlertCircle size={20} className="mr-2" />
                        <span>{commentsError || "Error loading comments"}</span>
                    </div>
                ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        No comments yet. {isAuthenticated ? "Be the first to share your thoughts!" : "Log in to add a comment."}
                    </div>
                )}
            </div>

            {!isAuthenticated && (
                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg text-center">
                    <p className="text-blue-300">
                        You need to be logged in to add comments.
                    </p>
                </div>
            )}
        </motion.div>
    )
}