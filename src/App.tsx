import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

function App() {
  const [cats, setCats] = useState<{ id: number; name: string }[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("id")
      .then(({ data, error }) => {
        if (error) setErr(error.message)
        else setCats(data ?? [])
      })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Supabase 연결 테스트</h1>
      {err && <p className="text-red-500">에러: {err}</p>}
      <ul className="mt-2 list-disc pl-6" data-testid="cats">
        {cats.map((c) => (
          <li key={c.id}>{c.id}: {c.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
