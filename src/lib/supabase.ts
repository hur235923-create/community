import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anonKey) {
  throw new Error("Supabase 환경변수가 없습니다. .env.local을 확인하세요.")
}

export const supabase = createClient(url, anonKey)
