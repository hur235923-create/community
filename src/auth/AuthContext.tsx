import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { loadSession, saveSession } from "./session"
import type { SessionUser } from "./session"

type AuthCtx = {
  user: SessionUser | null
  signup: (username: string, password: string, nickname: string) => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => loadSession())

  useEffect(() => {
    saveSession(user)
  }, [user])

  async function signup(username: string, password: string, nickname: string) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle()
    if (existing) throw new Error("이미 존재하는 아이디입니다.")
    const { data, error } = await supabase
      .from("users")
      .insert({ username, password, nickname })
      .select("id, username, nickname")
      .single()
    if (error) throw new Error(error.message)
    setUser(data as SessionUser)
  }

  async function login(username: string, password: string) {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, nickname")
      .eq("username", username)
      .eq("password", password)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.")
    setUser(data as SessionUser)
  }

  function logout() {
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, signup, login, logout }}>{children}</Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error("useAuth must be used within AuthProvider")
  return c
}
