import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">
            커뮤니티
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="text-muted-foreground">{user.nickname}님</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<Link to="/login" />}
                >
                  로그인
                </Button>
                <Button size="sm" nativeButton={false} render={<Link to="/signup" />}>
                  회원가입
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
