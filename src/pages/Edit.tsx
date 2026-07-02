import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchPost, fetchCategories, updatePost, type Category } from "@/api/posts"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function Edit() {
  const { id } = useParams()
  const postId = Number(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cats, setCats] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    Promise.all([fetchCategories(), fetchPost(postId)])
      .then(([cs, post]) => {
        if (user?.id !== post.user_id) {
          toast.error("작성자만 수정할 수 있습니다.")
          navigate(`/posts/${postId}`)
          return
        }
        setCats(cs)
        setCategoryId(post.category_id)
        setTitle(post.title)
        setContent(post.content)
        setReady(true)
      })
      .catch((e) => toast.error(e.message))
  }, [postId, user])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!categoryId || !title.trim() || !content.trim()) {
      toast.error("모든 항목을 입력하세요.")
      return
    }
    try {
      await updatePost(postId, {
        categoryId,
        title: title.trim(),
        content: content.trim(),
      })
      toast.success("수정 완료")
      navigate(`/posts/${postId}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "오류")
    }
  }

  if (!ready) return <p className="text-muted-foreground">불러오는 중...</p>

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border bg-card p-6 shadow-[0_1px_2px_rgba(28,27,41,0.04)]"
    >
      <h1 className="text-xl font-extrabold tracking-tight">글 수정</h1>
      <div className="space-y-1.5">
        <Label htmlFor="category">카테고리</Label>
        <select
          id="category"
          className="h-10 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="title">제목</Label>
        <Input id="title" className="h-10" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => navigate(`/posts/${postId}`)}>
          취소
        </Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  )
}
