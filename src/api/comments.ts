import { supabase } from "@/lib/supabase"

export type CommentRow = {
  id: number
  content: string
  created_at: string
  user_id: number
  users: { nickname: string } | null
}

export async function fetchComments(postId: number): Promise<CommentRow[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, users(nickname)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as CommentRow[]
}

export async function addComment(
  postId: number,
  userId: number,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: userId, content })
  if (error) throw new Error(error.message)
}

export async function deleteComment(id: number): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
