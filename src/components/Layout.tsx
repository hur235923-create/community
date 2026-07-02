import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/auth/AuthContext"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-4.2 3.5A.6.6 0 0 1 5 18v-3H6.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[1.05rem] font-extrabold tracking-tight">
        모여<span className="text-primary">라</span>
      </span>
    </Link>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5">
          <Wordmark />
          <nav className="flex items-center gap-1.5 text-sm">
            {user ? (
              <>
                <span className="mr-1 hidden text-muted-foreground sm:inline">
                  <b className="font-semibold text-foreground">{user.nickname}</b>님
                </span>
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
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 pt-4 text-center text-xs text-muted-foreground/70">
        모여라 · 학습용 데모 커뮤니티
      </footer>
      <Toaster />
    </div>
  )
}
