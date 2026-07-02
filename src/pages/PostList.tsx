import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fetchPosts, POST_PAGE_SIZE, type PostRow } from "@/api/posts"
import { catBySlug } from "@/lib/category"
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "방금"
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}일 전`
  return new Date(iso).toLocaleDateString()
}

export default function PostList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cat, setCat] = useState("all")
  const [search, setSearch] = useState("")
  const [input, setInput] = useState("")
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<PostRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPosts({ categorySlug: cat, search, page })
      .then((r) => {
        setRows(r.rows)
        setTotal(r.total)
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [cat, search, page])

  const totalPages = Math.max(1, Math.ceil(total / POST_PAGE_SIZE))

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">이야기 모음</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user ? `${user.nickname}님, 오늘은 어떤 이야기를 나눌까요?` : "자유롭게 읽고, 로그인하면 함께 이야기할 수 있어요."}
          </p>
        </div>
        <Button className="shrink-0" onClick={() => navigate("/write")}>
          ✏️ 글쓰기
        </Button>
      </div>

      {/* 카테고리 + 검색 */}
      <div className="space-y-3">
        <Tabs
          value={cat}
          onValueChange={(v) => {
            setCat(String(v))
            setPage(0)
          }}
        >
          <TabsList className="bg-secondary/60">
            {CATS.map((c) => (
              <TabsTrigger key={c.slug} value={c.slug}>
                {c.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            setPage(0)
            setSearch(input)
          }}
        >
          <Input
            className="h-10 bg-card"
            placeholder="제목으로 검색"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="h-10" type="submit" variant="secondary">
            검색
          </Button>
        </form>
      </div>

      {/* 목록 */}
      <ul className="space-y-2.5">
        {loading ? (
          [0, 1, 2, 3].map((i) => (
            <li key={i} className="h-[74px] animate-pulse rounded-2xl border bg-card/60" />
          ))
        ) : rows.length === 0 ? (
          <li className="rounded-2xl border border-dashed bg-card/50 p-10 text-center text-sm text-muted-foreground">
            {search ? `'${search}' 검색 결과가 없어요.` : "아직 게시글이 없어요. 첫 글을 남겨보세요!"}
          </li>
        ) : (
          rows.map((p) => {
            const c = catBySlug(p.categories?.slug)
            return (
              <li key={p.id}>
                <Link
                  to={`/posts/${p.id}`}
                  className="group flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgba(28,27,41,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-8px_rgba(109,59,234,0.25)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-10 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: c.spine }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold ${c.chip}`}>
                        {c.name}
                      </span>
                      <h2 className="truncate font-semibold group-hover:text-primary">
                        {p.title}
                      </h2>
                    </div>
                    <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        {p.users?.nickname ?? "알수없음"}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{timeAgo(p.created_at)}</span>
                      <span aria-hidden="true">·</span>
                      <span>조회 {p.view_count}</span>
                    </p>
                  </div>
                </Link>
              </li>
            )
          })
        )}
      </ul>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </Button>
          <span className="text-sm tabular-nums text-muted-foreground">
            {page + 1} <span className="opacity-50">/ {totalPages}</span>
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
      )}
    </div>
  )
}
