"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card } from "./ui/card"

interface Comment {
  id: string
  content: string
  userId: string
  userName?: string
  createdAt: string
  resolved: boolean
}

interface CommentsPanelProps {
  draftId: string
}

export default function CommentsPanel({ draftId }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (draftId) {
      loadComments()
    }
  }, [draftId])

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/drafts/${draftId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error("Error loading comments:", error)
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/drafts/${draftId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        loadComments()
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-text-main">Comments</h3>
      
      <form onSubmit={handlePostComment} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <Button
          type="submit"
          disabled={loading || !newComment.trim()}
          variant="primary"
        >
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-3 mt-6">
        {comments.length === 0 ? (
          <p className="text-text-muted text-sm">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="border border-[#E0E5EC] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-text-main text-sm">
                    {comment.userName || "Anonymous"}
                  </p>
                  <p className="text-xs text-text-muted">{formatDate(comment.createdAt)}</p>
                </div>
                {comment.resolved && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-text-main text-sm">{comment.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

