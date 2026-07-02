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
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">로그인</h1>
      <div className="space-y-1">
        <Label htmlFor="username">아이디</Label>
        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "처리 중..." : "로그인"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link to="/signup" className="underline">
          회원가입
        </Link>
      </p>
    </form>
  )
}
