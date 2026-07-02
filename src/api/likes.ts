import { supabase } from "@/lib/supabase"

export async function fetchLikeState(
  postId: number,
  userId: number | null
): Promise<{ count: number; liked: boolean }> {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
  let liked = false
  if (userId) {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle()
    liked = !!data
  }
  return { count: count ?? 0, liked }
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
