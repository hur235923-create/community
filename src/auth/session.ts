export type SessionUser = { id: number; username: string; nickname: string }

const STORAGE_KEY = "community_user"

export function serializeUser(u: SessionUser): string {
  return JSON.stringify(u)
}

export function deserializeUser(raw: string | null): SessionUser | null {
  if (!raw) return null
  try {
    const p = JSON.parse(raw)
    if (
      typeof p?.id === "number" &&
      typeof p?.username === "string" &&
      typeof p?.nickname === "string"
    ) {
      return { id: p.id, username: p.username, nickname: p.nickname }
    }
    return null
  } catch {
    return null
  }
}

export function loadSession(): SessionUser | null {
  return deserializeUser(localStorage.getItem(STORAGE_KEY))
}

export function saveSession(u: SessionUser | null): void {
  if (u) localStorage.setItem(STORAGE_KEY, serializeUser(u))
  else localStorage.removeItem(STORAGE_KEY)
}
