import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchPosts, POST_PAGE_SIZE, type PostRow } from "@/api/posts"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const CATS = [
  { slug: "all", name: "전체" },
  { slug: "free", name: "자유게시판" },
  { slug: "qna", name: "질문" },
  { slug: "notice", name: "공지사항" },
]

export default function PostList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cat, setCat] = useState("all")
  const [search, setSearch] = useState("")
  const [input, setInput] = useState("")
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<PostRow[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchPosts({ categorySlug: cat, search, page })
      .then((r) => {
        setRows(r.rows)
        setTotal(r.total)
      })
      .catch((e) => toast.error(e.message))
  }, [cat, search, page])

  const totalPages = Math.max(1, Math.ceil(total / POST_PAGE_SIZE))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Tabs
          value={cat}
          onValueChange={(v) => {
            setCat(String(v))
            setPage(0)
          }}
        >
          <TabsList>
            {CATS.map((c) => (
              <TabsTrigger key={c.slug} value={c.slug}>
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button onClick={() => navigate("/write")}>글쓰기</Button>
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          setPage(0)
          setSearch(input)
        }}
      >
        <Input placeholder="제목 검색" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button type="submit" variant="secondary">
          검색
        </Button>
      </form>

      <ul className="divide-y rounded-md border">
        {rows.length === 0 && (
          <li className="p-4 text-center text-muted-foreground">게시글이 없습니다.</li>
        )}
        {rows.map((p) => (
          <li key={p.id} className="p-3 hover:bg-muted/50">
            <Link to={`/posts/${p.id}`} className="block">
              <div className="flex items-center gap-2">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                  {p.categories?.name}
                </span>
                <span className="font-medium">{p.title}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {p.users?.nickname ?? "알수없음"} · 조회 {p.view_count} ·{" "}
                {new Date(p.created_at).toLocaleDateString()}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          이전
        </Button>
        <span className="text-sm">
          {page + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          다음
        </Button>
      </div>
      {!user && (
        <p className="text-center text-xs text-muted-foreground">
          글쓰기·댓글·좋아요는 로그인이 필요합니다.
        </p>
      )}
    </div>
  )
}
