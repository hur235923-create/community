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
    <div className="mx-auto max-w-sm py-6">
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border bg-card p-7 shadow-[0_1px_2px_rgba(28,27,41,0.04)]"
      >
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">모여라에 오신 걸 환영해요</h1>
          <p className="mt-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700 ring-1 ring-amber-600/15">
            학습용 데모입니다. 실제 비밀번호·개인정보는 넣지 마세요.
          </p>
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
        <div className="space-y-1.5">
          <Label htmlFor="nickname">닉네임</Label>
          <Input
            id="nickname"
            className="h-10"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <Button type="submit" className="h-10 w-full" disabled={loading}>
          {loading ? "처리 중..." : "가입하기"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </div>
  )
}
