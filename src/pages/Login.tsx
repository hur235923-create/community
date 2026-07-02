import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      toast.success("로그인 완료!")
      navigate(location.state?.from ?? "/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "로그인 실패")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm py-6">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border bg-card p-7 shadow-[0_1px_2px_rgba(28,27,41,0.04)]"
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">다시 오셨네요 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">로그인하고 이야기에 참여해보세요.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">아이디</Label>
          <Input
            id="username"
            className="h-10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            className="h-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-10 w-full" disabled={loading}>
          {loading ? "처리 중..." : "로그인"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  )
}
