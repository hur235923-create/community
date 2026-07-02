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
import { catBySlug } from "@/lib/category"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
      {name.slice(0, 1)}
    </span>
  )
}

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

  if (!post) return <p className="py-16 text-center text-muted-foreground">불러오는 중...</p>
  const isAuthor = user?.id === post.user_id
  const c = catBySlug(post.categories?.slug)

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← 목록으로
      </button>

      <article className="overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(28,27,41,0.04)]">
        <div className="h-1.5" style={{ backgroundColor: c.spine }} />
        <div className="space-y-4 p-6">
          <div>
            <span className={`rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold ${c.chip}`}>
              {c.name}
            </span>
            <h1 className="mt-2.5 text-2xl font-extrabold leading-snug tracking-tight">
              {post.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar name={post.users?.nickname ?? "?"} />
              <span className="font-medium text-foreground/80">{post.users?.nickname}</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(post.created_at).toLocaleString()}</span>
              <span aria-hidden="true">·</span>
              <span>조회 {post.view_count}</span>
            </div>
          </div>

          <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">
            {post.content}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onToggleLike}
              aria-pressed={like.liked}
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={
                like.liked
                  ? { backgroundColor: "var(--heart)", borderColor: "var(--heart)", color: "#fff" }
                  : { color: "var(--heart)", borderColor: "color-mix(in srgb, var(--heart) 40%, transparent)" }
              }
            >
              <span>{like.liked ? "♥" : "♡"}</span>
              <span className="tabular-nums">{like.count}</span>
            </button>
            <span className="text-xs text-muted-foreground">공감</span>

            {isAuthor && (
              <div className="ml-auto flex gap-2">
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
              </div>
            )}
          </div>
        </div>
      </article>

      {/* 댓글 */}
      <section className="space-y-3 rounded-2xl border bg-card p-6 shadow-[0_1px_2px_rgba(28,27,41,0.04)]">
        <h2 className="font-bold">
          댓글 <span className="text-primary">{comments.length}</span>
        </h2>

        <form onSubmit={onAddComment} className="space-y-2">
          <Textarea
            placeholder={user ? "따뜻한 댓글을 남겨주세요" : "로그인 후 작성할 수 있어요"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-background"
          />
          <div className="text-right">
            <Button type="submit" size="sm">
              등록
            </Button>
          </div>
        </form>

        <ul className="space-y-2.5">
          {comments.length === 0 && (
            <li className="py-6 text-center text-sm text-muted-foreground">
              아직 댓글이 없어요. 첫 댓글을 남겨보세요.
            </li>
          )}
          {comments.map((cm) => (
            <li key={cm.id} className="rounded-xl bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={cm.users?.nickname ?? "?"} />
                  <span className="font-semibold">{cm.users?.nickname ?? "알수없음"}</span>
                </div>
                {user?.id === cm.user_id && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
                    onClick={() => onDeleteComment(cm.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap pl-9 text-foreground/90">{cm.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
