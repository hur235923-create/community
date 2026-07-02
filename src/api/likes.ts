import { supabase } from "@/lib/supabase"

export async function fetchLikeState(
  postId: number,
  userId: number | null
): Promise<{ count: number; liked: boolean }> {
  // 단일 GET으로 좋아요 행을 받아 개수와 내 좋아요 여부를 클라이언트에서 계산한다.
  // (HEAD 카운트 요청은 mount 시 동시 요청들과 경쟁하다 간헐적으로 중단되어 사용하지 않는다.)
  const { data, error } = await supabase
    .from("likes")
    .select("user_id")
    .eq("post_id", postId)
  if (error) throw new Error(error.message)
  const rows = data ?? []
  const liked = userId ? rows.some((r) => r.user_id === userId) : false
  return { count: rows.length, liked }
}

export async function toggleLike(
  postId: number,
  userId: number,
  liked: boolean
): Promise<void> {
  if (liked) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: userId })
    if (error) throw new Error(error.message)
  }
}
