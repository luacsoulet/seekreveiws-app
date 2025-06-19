import { motion, Variants } from "framer-motion"
import { MessageSquare, Send, Loader2 } from "lucide-react"
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
    addCommentError = null
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
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment here..."
                                className="flex-1 bg-gray-800/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoComplete="on"
                                disabled={addCommentLoading}
                            />
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
                            <div className="mt-3 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
                                {addCommentError}
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
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
                        {commentsError || "Error loading comments"}
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