import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchPost, incrementView, deletePost, type PostRow } from "@/api/posts"
import {
  fetchComments,
  addComment,
  deleteComment,
  type CommentRow,
} from "@/api/comments"
import { fetchLikeState, toggleLike } from "@/api/likes"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function PostDetail() {
  const { id } = useParams()
  const postId = Number(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostRow | null>(null)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [like, setLike] = useState({ count: 0, liked: false })
  const [text, setText] = useState("")

  useEffect(() => {
    incrementView(postId)
    fetchPost(postId)
      .then(setPost)
      .catch((e) => toast.error(e.message))
    fetchComments(postId)
      .then(setComments)
      .catch((e) => toast.error(e.message))
  }, [postId])

  useEffect(() => {
    fetchLikeState(postId, user?.id ?? null)
      .then(setLike)
      .catch(() => {})
  }, [postId, user])

  async function onToggleLike() {
    if (!user) {
      navigate("/login")
      return
    }
    try {
      await toggleLike(postId, user.id, like.liked)
      setLike(await fetchLikeState(postId, user.id))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "오류")
    }
  }

  async function onAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      navigate("/login")
      return
    }
    if (!text.trim()) return
    try {
      await addComment(postId, user.id, text.trim())
      setText("")
      setComments(await fetchComments(postId))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "오류")
    }
  }

  async function onDeletePost() {
    if (!confirm("삭제하시겠습니까?")) return
    try {
      await deletePost(postId)
      toast.success("삭제됨")
      navigate("/")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "오류")
    }
  }

  async function onDeleteComment(cid: number) {
    try {
      await deleteComment(cid)
      setComments(await fetchComments(postId))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "오류")
    }
  }

  if (!post) return <p className="text-muted-foreground">불러오는 중...</p>
  const isAuthor = user?.id === post.user_id

  return (
    <article className="space-y-4">
      <div>
        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
          {post.categories?.name}
        </span>
        <h1 className="mt-2 text-2xl font-bold">{post.title}</h1>
        <div className="mt-1 text-xs text-muted-foreground">
          {post.users?.nickname} · 조회 {post.view_count} ·{" "}
          {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
      <p className="whitespace-pre-wrap">{post.content}</p>

      <div className="flex items-center gap-2">
        <Button
          variant={like.liked ? "default" : "outline"}
          size="sm"
          onClick={onToggleLike}
        >
          ♥ {like.count}
        </Button>
        {isAuthor && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/posts/${postId}/edit`)}
            >
              수정
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeletePost}>
              삭제
            </Button>
          </>
        )}
      </div>

      <section className="space-y-3 border-t pt-4">
        <h2 className="font-semibold">댓글 {comments.length}</h2>
        <form onSubmit={onAddComment} className="space-y-2">
          <Textarea
            placeholder={user ? "댓글을 입력하세요" : "로그인 후 작성 가능"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="text-right">
            <Button type="submit" size="sm">
              등록
            </Button>
          </div>
        </form>
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="rounded border p-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{c.users?.nickname ?? "알수없음"}</span>
                {user?.id === c.user_id && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline"
                    onClick={() => onDeleteComment(c.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
