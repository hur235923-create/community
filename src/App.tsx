import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">shadcn 렌더 테스트</h1>
      <Button>기본 버튼</Button>
      <Button variant="secondary">보조 버튼</Button>
      <Button variant="destructive">삭제 버튼</Button>
    </div>
  )
}

export default App
