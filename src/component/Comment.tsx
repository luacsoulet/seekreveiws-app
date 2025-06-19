import { motion } from "framer-motion"
import { Comment as CommentType } from "@/utils/types"

export const Comment = ({ comment }: { comment: CommentType }) => {
    return (
        <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 rounded-lg p-4"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        {comment.user_id?.toString().charAt(0) || "U"}
                    </div>
                    <span className="font-medium text-white">{comment.user_id?.toString() || "Anonymous"}</span>
                </div>
                <span className="text-gray-400 text-sm">
                    {new Date(comment.created_at).toLocaleDateString()}
                </span>
            </div>
            <p className="text-gray-300">{comment.message}</p>
        </motion.div>
    )
}