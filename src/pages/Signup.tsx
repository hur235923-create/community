import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!username || !password || !nickname) {
      toast.error("모든 항목을 입력하세요.")
      return
    }
    setLoading(true)
    try {
      await signup(username, password, nickname)
      toast.success("회원가입 완료!")
      navigate("/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "가입 실패")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">회원가입</h1>
      <p className="text-xs text-muted-foreground">
        학습용입니다. 실제 비밀번호·개인정보를 넣지 마세요.
      </p>
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
      <div className="space-y-1">
        <Label htmlFor="nickname">닉네임</Label>
        <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "처리 중..." : "가입하기"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="underline">
          로그인
        </Link>
      </p>
    </form>
  )
}
